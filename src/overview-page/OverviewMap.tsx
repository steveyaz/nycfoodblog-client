import { Colors, Icon } from "@blueprintjs/core";
import { LatLng } from "leaflet";
import { DivIcon as LeafletIcon } from "leaflet";
import * as React from "react";
import { renderToString } from "react-dom/server";
import { Map as LeafletMap, Marker, Popup, TileLayer } from "react-leaflet";
import { Link } from "react-router-dom";
import { WirePost } from "../data/WirePost";

export namespace OverviewMap {

  export interface OwnProps {
    posts: ReadonlyArray<WirePost>;
  }

  export type Props = OwnProps;

}

export const mapIcon = new LeafletIcon({
  html: renderToString(<Icon icon="map-marker" iconSize={24} color={Colors.GOLD3} />),
  iconAnchor: [14, 22],
  popupAnchor: [0, -22],
})

export class OverviewMap extends React.PureComponent<OverviewMap.Props, {}> {

  public render() {
    return (
      <div id="map-container">
        <LeafletMap center={new LatLng(40.7685, -73.9809)} position={[51.505, -0.09]} zoom={13}>
          <TileLayer
            url="https://stamen-tiles-{s}.a.ssl.fastly.net/toner-lite/{z}/{x}/{y}{r}.png"
            attribution="Map tiles by <a href=&quot;http://stamen.com&quot;>Stamen Design</a>, <a href=&quot;http://creativecommons.org/licenses/by/3.0&quot;>CC BY 3.0</a> &mdash; Map data &copy; <a href=&quot;https://www.openstreetmap.org/copyright&quot;>OpenStreetMap</a> contributors"
          />
          { this.props.posts.map(post => {
                return (
                  <Marker
                    key={post.id}
                    position={[post.latitude, post.longitude]}
                    icon={mapIcon}
                  >
                    <Popup>
                      <div>
                        <Link className="map-popup-address" to={`/post/${post.id}`}>{post.restaurantName}</Link>
                        <div className="map-popup-address">{post.addressStreet}</div>
                        <div className="map-popup-address">{post.addressCity}, {post.addressState} {post.addressZip}</div>
                      </div>
                    </Popup>
                  </Marker>
                )
              })}
        </LeafletMap>
      </div>
    );
  }
}
