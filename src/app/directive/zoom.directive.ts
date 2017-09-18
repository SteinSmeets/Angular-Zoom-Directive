import {Directive, ElementRef, HostListener, Input, Renderer2, ViewChild} from "@angular/core";

@Directive({
  selector: '[ng-zoom]'
})
export class ZoomDirective {

  private zoomStep:number= 0.1;
  private pinchStep:number = 0.05;
  private currentZoom:number= 1;
  private zoomTarget:Element;
  private zoomPoint:Point;

  @Input("minZoom")minZoom:number =1;
  @Input("maxZoom")maxZoom:number = 2;

  @HostListener('wheel', ['$event']) onWheel(event){
    console.log("Wheel", event)
    if(event.ctrlKey){
      event.preventDefault();
      let ratios = this.getContainerRatios();
      this.zoomPoint = {x:event.x, y: event.y}
      this.zoomIntoContainer(this.zoomPoint,ratios, (event.deltaY<0)?this.zoomStep:-this.zoomStep);
    }
  }
  @HostListener('tap', ['$event']) onTouch(event){
    console.log("TOUCH", event);
  }
  @HostListener('pinchin', ['$event']) onPinchIn( event){
    console.log("PINCH", event)
    if(event.velocityY ==0)return;
    let ratios = this.getContainerRatios();
    this.zoomPoint = {x:event.center.x, y: event.center.y}
    this.zoomIntoContainer(this.zoomPoint, ratios, -this.pinchStep);
  }
  @HostListener('pinchout', ['$event']) onPinchOut( event){
    console.log("PINCH", event)
    if(event.velocityY ==0)return;
    let ratios = this.getContainerRatios();
    this.zoomPoint = {x:event.center.x, y: event.center.y}
    this.zoomIntoContainer(this.zoomPoint, ratios, this.pinchStep);
  }

  constructor(private render:Renderer2, private elRef:ElementRef){

  }

  private getContainerRatios():any{
    let ratioX, ratioY;
    if(this.elRef.nativeElement.scrollWidth > this.elRef.nativeElement.scrollHeight){
      ratioX = 1;
      ratioY = this.elRef.nativeElement.scrollHeight/this.elRef.nativeElement.scrollWidth;
    }else{
      ratioX = this.elRef.nativeElement.scrollWidth/this.elRef.nativeElement.scrollHeight;
      ratioY = 1;
    }
    return {x:ratioX, y:ratioY};
  }
  private zoomIntoContainer(zoomPoint:Point, ratios:any, zoomStep:number){
    let prevDif = {right: this.zoomTarget.getBoundingClientRect().right - this.zoomPoint.x , bottom:this.zoomTarget.getBoundingClientRect().bottom - this.zoomPoint.y }

    if(!this.setNewZoomLevel(zoomStep))return;

    this.render.setStyle(this.zoomTarget, "transform", "scale("+this.currentZoom+")");
    let afterDif = {right: this.zoomTarget.getBoundingClientRect().right - this.zoomPoint.x , bottom:this.zoomTarget.getBoundingClientRect().bottom - this.zoomPoint.y }

    let scrollLeft = ((afterDif.right-prevDif.right)/2)*ratios.x;
    let scrollTop = ((afterDif.bottom-prevDif.bottom)/2)*ratios.y;

   // console.log(this.getTargetCenter())
    console.log(zoomPoint)
    //console.log(this.getCenterDeviation(this.getTargetCenter(), zoomPoint));


    this.elRef.nativeElement.scrollLeft += scrollLeft + this.getCenterDeviation(this.getTargetCenter(), zoomPoint).x;
    this.elRef.nativeElement.scrollTop += scrollTop + this.getCenterDeviation(this.getTargetCenter(), zoomPoint).y;
  }

  private previousZoom:number = 0;
  private setNewZoomLevel(zoomStep:number):boolean{
    this.currentZoom += zoomStep;
    if(this.currentZoom < this.minZoom){
      this.currentZoom = this.minZoom;
      if(this.previousZoom == this.currentZoom)return false;
    }else if(this.currentZoom > this.maxZoom){
      this.currentZoom = this.maxZoom;
      if(this.previousZoom == this.currentZoom)return false;

    }

    this.previousZoom = this.currentZoom;

    return true;
  }
  private getTargetCenter():Point{
    let rectangle = this.elRef.nativeElement.getBoundingClientRect();
    return {x: rectangle.left + (rectangle.width/2) ,y: rectangle.top + (rectangle.height/2)}
  }
  private getCenterDeviation(center:Point, zoomPoint:Point):Point{

      return {x: (zoomPoint.x - center.x)*0.1, y: (zoomPoint.y - center.y)*0.1};
  }

  ngOnInit(){
    this.zoomTarget = document.getElementById("zoomTarget");

    this.render.listen('document', 'click', (event)=>{
      console.log("fdfqsd")
    })
  }
}

export class Point{
  x:number;
  y:number;
}
