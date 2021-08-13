import { Component, ElementRef, OnInit, ViewChild, Output, Input, EventEmitter} from '@angular/core';
import { loadModules } from "esri-loader";

@Component({
  selector: 'app-esri-map',
  templateUrl: './esri-map.component.html',
  styles:['@import url("https://js.arcgis.com/4.20/esri/themes/light/main.css")'],
  styleUrls: ['./esri-map.component.css']
})
export class EsriMapComponent implements OnInit {
  
  @Output() mapPrintWidgetLoaded = new EventEmitter();
  @Output() mapExportedEvent = new EventEmitter<string>();

  @Input() defaultLayerUrl:string = "";
  public mapView;
  public map;
  public print;
  public esriConfig;
  private featureLayerUrl:string = "";  
  customLayerUrl:string = "";
  @ViewChild('mapViewNode') private mapViewEl: ElementRef;
  public esriApiKey:string = "AAPK1763de5d5bc9473a9d536e43c5177ae523CpjsX9hyYOEpPVn5vam4cmU3JuJ32vPeB0OciPRt30EgSr8UA9JOSY-xktECC1";
  @Input() editAccess:boolean = false;
  editor: any;
  mainLayerUrl:string = "https://services3.arcgis.com/kczRz2Uba1r8Y3NM/arcgis/rest/services/redlist_species_data_7b024e64_0fd8_48a2_adf0_8e43737b5cb3/FeatureServer/0";
  pointLayerUrl:string = "https://services3.arcgis.com/kczRz2Uba1r8Y3NM/arcgis/rest/services/my_points/FeatureServer";
  exportPDFUrl:string = "";
  constructor() { }

  ngOnInit(): void {
    
  }
  polygonEditor:any;
  polygonEditorActive:boolean = false;
  loadPolygonEditor(){
    loadModules(['esri/widgets/Editor'])
    .then(
      ([Editor]) => {
        // Set the polygon layer's LayerInfo
        const pointInfos = {
          layer: this.pointLayer,
          fieldConfig: [{
            name: "HazardType",
            label: "Hazard type"
          }, {
            name: "Description",
            label: "Description"
          }, {
            name: "SpecialInstructions",
            label: "Special Instructions"
          }, {
            name: "Status",
            label: "Status"
          }, {
            name: "Priority",
            label: "Priority"
          }]
        };
        
        this.polygonEditor = new Editor({
          layerInfos:[
          {
            layer:this.pointLayer,
            fieldConfig:[pointInfos]
          }
          ],
          view:this.mapView
        });
        this.mapView.ui.add(this.polygonEditor,'top-right');
        this.polygonEditorActive = true;
      }
    )
  }
  removePolygonEditor(){
    this.mapView.ui.remove(this.polygonEditor);
    this.polygonEditorActive = false;
  }
  loadCustomLayer(){
    if(this.customLayerUrl != ""){
      this.loadFeatureLayer(this.customLayerUrl);
    }
  }
  loadMap(){
    console.log("Loading map");
    loadModules([
      "esri/config",
      "esri/Map",
      "esri/views/MapView",
      "esri/layers/FeatureLayer",
      "esri/layers/GraphicsLayer",
      'esri/widgets/Print',
      "esri/WebMap"
    ])
    .then(
      ([esriConfig,Map, MapView,FeatureLayer,GraphicsLayer,Print,WebMap]) => {
          this.graphicsLayer = new GraphicsLayer();
          esriConfig.apiKey = this.esriApiKey;
          //esriConfig.portalUrl = "https://sdlv8xceqid9xkda.maps.arcgis.com";
          console.log(this.defaultLayerUrl);
          this.map = new WebMap({
            portalItem:{
              id: this.defaultLayerUrl//'f052841110864fa9bf6373301d6eee2e'
            },
            layers:[this.graphicsLayer]
          }) //({basemap:'topo-vector',layers:[this.graphicsLayer]});
          this.mapView = new MapView({
            container: this.mapViewEl.nativeElement,
            map:this.map
          });

          this.mapView.when(()=>{
            
          })
          
      }
    );

  }
  // 
  defaultLayer:any;
  pointLayer:any;
  loadDefaultLayer(){
    console.log(this.defaultLayerUrl);
    if(this.defaultLayerUrl != ""){
      loadModules(['esri/layers/FeatureLayer'])
      .then(
        ([FeatureLayer]) =>{
          this.defaultLayer = new FeatureLayer({url:this.defaultLayerUrl})
          this.map.add(this.defaultLayer);
          
          this.pointLayer = new FeatureLayer({url:this.pointLayerUrl})
          this.map.add(this.pointLayer);
        }
      )
    }
    else{
      loadModules(['esri/layers/FeatureLayer'])
      .then(
        ([FeatureLayer]) =>{
          this.defaultLayer = new FeatureLayer({url:'https://services3.arcgis.com/kczRz2Uba1r8Y3NM/arcgis/rest/services/redlist_species_data_7b024e64_0fd8_48a2_adf0_8e43737b5cb3/FeatureServer'})
          this.map.add(this.defaultLayer);
        }
      )
    }
    
  }
  loadCoWidget(){
    loadModules(['esri/widgets/CoordinateConversion'] )
    .then(
      ([CoWidget])=>{
        let coWidget = new CoWidget({
          view:this.mapView
        });
        this.mapView.ui.add(coWidget,'top-right');
      }
    )
  }
  pingComponent(){
    console.log("Ping!");
  }
  loadFeatureLayer(url:string){
    loadModules(['esri/layers/FeatureLayer'])
    .then(
      ([FeatureLayer]) =>{
        const layer = new FeatureLayer({url:url})
        this.map.add(layer);
      }
    )
  }

  loadWidget(){
    loadModules(['esri/widgets/LayerList'])
    .then(
      ([LayerList]) =>{
        let ll = new LayerList({view:this.mapView});
        this.mapView.ui.add(ll);
      }
    )
  }
  printMap(){
    console.log("Printing map...");
    loadModules(['esri/config','esri/widgets/Print'])
    .then(
      ([esriConfig,Print]) =>{
        this.print = new Print({
          view: this.mapView,
          // specify your own print service
          printServiceUrl:
            "https://utility.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task",
            allowedFormats: ["png32"]
        });
        
        this.print.on("complete", (results)=>{

          console.log("COMPLETE");
          this.mapExportedEvent.emit(results.link.url);

        })
        this.mapView.ui.add(this.print,'top-right');
        this.mapPrintWidgetLoaded.emit();
        esriConfig.request.interceptors.push({
          // set the `urls` property to the URL of the print service so that this
          // interceptor only applies to requests made to the print service URL
          urls: this.print.printServiceUrl,
          // use the AfterInterceptorCallback to interogate the exportedLinks property
          after: (response) => {

          }
        });

      }
    )
  }
  postExport(){
    console.log(JSON.stringify(this.print.exportedLinks.items[0]));
  }

  /* ----------
      Hard coded widgets
  -------------*/
  graphicsLayer:any;
  sketch:any;
  sketchActive:boolean = false;
  loadSketchWidget(){
    
    loadModules(['esri/widgets/Sketch','esri/layers/GraphicsLayer'])
    .then(
      ([Sketch]) => { 
        this.sketch = new Sketch({
          layer:this.graphicsLayer,
          view:this.mapView,
          creationMode:"update"
          }
        );
        this.mapView.ui.add(this.sketch);
        this.sketchActive = true;
      }
    )
  }
  removeSketchWidget(){
    this.mapView.ui.remove(this.sketch);
    this.sketchActive = false;
  }
  areaWidget:any;
  areaWidgetActive:boolean = false;
  loadAreaWidget(){
    loadModules(['esri/widgets/AreaMeasurement2D'])
    .then(
      ([AreaMeasurement2D ]) =>{
        this.areaWidget = new AreaMeasurement2D({view:this.mapView});
        this.mapView.ui.add(this.areaWidget,'top-right');
        this.areaWidgetActive = true;
      }
    )
  }
  removeAreaWidget(){
    this.mapView.ui.remove(this.areaWidget);
    this.areaWidgetActive = false;
  }

  legendWidget:any;
  legendWidgetActive:any;
  loadLegendWidget(){
    loadModules(['esri/widgets/Legend'])
    .then(
      ([legend]) =>{
        this.legendWidget = new legend();
        this.mapView.ui.add(this.legendWidget,'top-right');
        this.legendWidgetActive = true;
      }
    )
  }
  removeLegendWidget(){
    this.mapView.ui.remove(this.legendWidget);
    this.legendWidgetActive = false;
  }
}
