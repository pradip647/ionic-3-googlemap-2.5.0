import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import {
  GoogleMaps,
  GoogleMap,
  GoogleMapsEvent,
  GoogleMapOptions,
  CameraPosition,
  Marker,
  LatLng,
  ILatLng,
  PolylineOptions,
  Encoding,
  Polyline
} from '@ionic-native/google-maps';
import { SearchScreenPage } from '../search-screen/search-screen';
import { HTTP } from '@ionic-native/http';

declare var google: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  public map: GoogleMap;
  public marker:any;

  public searchData:any;
  public startPoint = {
    lat:22.5764753,
    lng:88.4306861
  }
  public endPoint = {}

  constructor(public navCtrl: NavController,public modalCtrl:ModalController,public http:HTTP) {

  }

  // Load map only after view is initialized
  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap(){
    let mapOptions: GoogleMapOptions = {
      camera: {
        target: this.startPoint,
        zoom: 13,
        tilt: 0
      },
      gestures: { tilt: false },
      building: false
    };
    this.map = GoogleMaps.create('map_canvas', mapOptions);
    this.map.one(GoogleMapsEvent.MAP_READY).then(() => {
        
        // let lendata = [{lat:43.0741904,lng:-89.3809802},{lat:37.422858,lng:-122.085065}]
        // for(let i=0; i<lendata.length; i++){
          this.addMarker(this.startPoint,"red");
        // }
        // this.addMarker(markerLatLng)
        
        // this.map.addPolygon({
        //   points: [{lat:43.0741904,lng:-89.3809802},{lat:37.422858,lng:-122.085065}],
        //   color : '#AA00FF',
        //   width: 2,
        //   geodesic: true,
        // })

    });
  }

  addMarker(data, color){
    this.map.addMarker({
      icon:color,
      position:data,
      disableAutoPan:false
    }).then((success:any)=>{
      // this.map.animateCamera({
      //   'target': data,
      //     zoom:14,
      //     tilt: 60,
      //     bearing: 140,
      //     duration: 5000
      // })
    })
    .catch((error:any)=>{console.log("Marker add error : ", error)});
  }

  /* Open Search modal */
  opensearchmodal(){
    let openmodal = this.modalCtrl.create(SearchScreenPage);
    openmodal.present();
    openmodal.onDidDismiss((addressdata:any)=>{
          if(addressdata !=undefined || addressdata != null || addressdata != ''){
            if(addressdata.markerposition){
              this.searchData = addressdata.address;
              // this.map.clear();
              // this.addMarker(addressdata.markerposition,"blue")
              // this.map.addPolygon({
              //   points: [{lat:43.0741904,lng:-89.3809802},{lat:37.422858,lng:-122.085065}],
              //   color : '#AA00FF',
              //   width: 2,
              //   geodesic: true,
              // })
              this.fetchroute(this.startPoint,addressdata.markerposition)

            }
          }else{
            this.searchData = null
          }
    })
  }


  fetchroute(origin:any, destination:any){
    let apiKey:any = "AIzaSyBT8yxtiDqtDbZNBSU-h3BUYwb-_NYhkak";
    this.http.get('https://maps.googleapis.com/maps/api/directions/json?origin='+origin.lat+','+origin.lng+'&destination='+destination.lat+','+destination.lng+'&mode=driving&units=metric&sensor=false&key='+apiKey, {}, {})
    .then((data:any) => {
      let dataobj = JSON.parse(data.data);
      let overview:any = dataobj.routes[0].overview_polyline;
      this.map.clear().then(() => {
        let polyoptions: PolylineOptions = {
          points: GoogleMaps.getPlugin().geometry.encoding.decodePath(overview.points),
          color: '#000000',
          width: 3,
          geodesic: true
        };
        this.map.addPolyline(polyoptions).then((polyline: Polyline) =>{
            this.addMarker(origin,"red");
            this.addMarker(destination,"blue")
        })
        
      });
    })
    .catch((error:any) => {
      console.log(error);
    });
  }


}
