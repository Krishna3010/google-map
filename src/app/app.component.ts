import {Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {GoogleMap, MapInfoWindow, MapMarker} from '@angular/google-maps';
import {Safe} from './safe-pipe';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'google-map';
  zoom = 10;
  center: google.maps.LatLngLiteral;
  markers = [];
  options: google.maps.MapOptions = {
    mapTypeId: 'roadmap',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    maxZoom: 18,
    minZoom: 4,
  };
  directionsService: google.maps.DirectionsService;
  directionsRenderer: google.maps.DirectionsRenderer;
  travelMode: any;
  alphabet: string[] = ['A', 'B', 'C', 'D'];

  @ViewChild('map', {static: false}) map: GoogleMap;
  @ViewChild(MapInfoWindow, {static: false}) info: MapInfoWindow;
  @ViewChildren(MapInfoWindow) infoWindowsView: QueryList<MapInfoWindow>;

  ngOnInit() {
    // navigator.geolocation.getCurrentPosition(position => {
    //   this.center = {
    //     lat: position.coords.latitude,
    //     lng: position.coords.longitude,
    //   };
    // });
    this.center = {lat: 19.1250474, lng: 72.8875394};
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer(
      {suppressInfoWindows: true, suppressMarkers: true}
    );
    this.travelMode = google.maps.TravelMode.DRIVING;
    this.addMarker();
  }

  zoomIn() {
    if (this.zoom < this.options.maxZoom) {
      this.zoom++;
    }
  }

  zoomOut() {
    if (this.zoom > this.options.minZoom) {
      this.zoom--;
    }
  }

  click(event: google.maps.MouseEvent) {
    // if (this.markers.length < 4) {
    //   this.addMarker(event);
    // }
  }

  addMarker() {
    const latLong = [
      {lat: 19.2317736, lng: 72.8281944},
      {lat: 19.0124985, lng: 72.8424363},
      {lat: 19.1250474, lng: 72.8875394},
      {lat: 19.0687793, lng: 72.8230148}];
    for (const lt of latLong) {
      this.markers.push({
        position: lt,
        label: {
          color: 'white',
          text: this.alphabet[this.markers.length]
        },
        title: this.alphabet[this.markers.length]
      });
    }
  }

  openInfo(mapMarker: MapMarker, windowIndex) {
    // console.log(mapMarker);
    // console.log(marker);
    // console.log(marker.position);
    // this.info.infoWindow.setPosition(marker.position);
    this.info.open(mapMarker);
    /// stores the current index in forEach
    let curIdx = 0;
    this.infoWindowsView.forEach((window: MapInfoWindow) => {
      window.close();
      if (windowIndex === curIdx) {
        window.open(mapMarker);
        curIdx++;
      } else {
        curIdx++;
      }
    });
  }

  calculateDirection() {
    this.directionsRenderer.setMap(this.map.googleMap);
    console.log(this.markers);
    let origin;
    let destination;
    const waypts = [];
    for (const i of this.markers) {
      console.log(i);
      if (i.sqnumber === 1) {
        origin = i;
      }
      if (i.sqnumber === 4) {
        destination = i;
      }
      if (i.sqnumber === 2 || i.sqnumber === 3) {
        waypts.push({
          location: i.position,
          stopover: true
        });
      }
    }
    console.log(waypts);
    this.directionsService.route(
      {
        origin: origin.position,
        destination: destination.position,
        waypoints: waypts,
        optimizeWaypoints: true,
        travelMode: this.travelMode
      },
      (response, status) => {
        console.log(response);
        if (status === 'OK') {
          this.directionsRenderer.setDirections(response);
        } else {
          window.alert('Directions request failed due to ' + status);
        }
      }
    );
  }

  setMarkerNumber(mapIndex: number, event) {
    console.log(mapIndex);
    console.log(event);
    this.markers[mapIndex].sqnumber = event.value;
  }

  resetMarkers() {
    window.location.reload();
  }
}
