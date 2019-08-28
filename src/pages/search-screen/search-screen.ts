import { Component, ViewChild, NgZone } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

declare var google: any;

@Component({
  selector: 'page-search-screen',
  templateUrl: 'search-screen.html',
})
export class SearchScreenPage {
  @ViewChild("search")
  public searchElementRef; searchtxt:any = '';

  autocompleteItems:any = [];
  searchtext:any;
  

  latitude: number = 0;
  longitude: number = 0;
  geo: any

  service = new google.maps.places.AutocompleteService();
  showLineLoader:any = false;

  selectedIndex:any = '';
  selectetdPackage:any = 0;

  
  constructor(
    public ngZone:NgZone,
    public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl:ViewController) {

      this.searchtxt = "";
  }

  backtoMapScreen(data){
    this.viewCtrl.dismiss(data)
  }



  pickupSearch(){
    // this.showLineLoader = true;
    this.service.getPlacePredictions({
      input: this.searchtext,
    }, (predictions, status) => {
      this.autocompleteItems = [];
      this.ngZone.run(() => {
      if (predictions != null) {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction.description);
          });
          // this.showLineLoader = false;
        }
      });
    });
  }


  chooseItem(item: any) {
  
    this.geoCode(item).then((success:any)=>{
      // this.showLineLoader = false;
      if(success){
        console.log("geocode success :", success);
          let data = {
            address:success.formatted_address,
            markerposition:{
              lat:success.geometry.location.lat(),
              lng:success.geometry.location.lng()
            }
          }
          this.autocompleteItems = [];
          this.backtoMapScreen(data);
          
      }
        
    })
  }

  //convert Address string to lat and long
  geoCode(address:any):Promise<any> {
    return new Promise((success)=>{
      let geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, (results, status) => {
        // console.log(results);
        console.log(results, results[0].formatted_address,results[0].geometry.location.lat(), results[0].geometry.location.lat())
        success(results[0]);
        // this.viewCtrl.dismiss(results[0].formatted_address);
      })
    })
  }

}
