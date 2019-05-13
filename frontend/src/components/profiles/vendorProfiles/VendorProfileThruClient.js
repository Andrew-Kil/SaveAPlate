import React, { Component } from "react";
import axios from "axios";
import { getFoodItemsByVendor } from "../../../utils/UtilFoodItems.js";
import "./vendorProfilesCSS/VendorProfileThruClient.css";
import Button from "@material-ui/core/Button";
import { withRouter } from "react-router-dom";

class VendorProfileThruClient extends Component {
  constructor() {
    super();
    this.state = {
      businessHours: [],
      foodInfo: [],
      allFavsForVendor: [],
      isFav: [],
      allVendors: []
    };
  }

  componentDidMount = async () => {
    await this.getBusinessHours();
    this.getfoodItems();
    this.getFavs();
    this.getAllVendors();
  };

  getAllVendors = () => {
    axios.get("/api/users/vendors/").then(foodItems => {
      this.setState({
        allVendors: foodItems.data.vendors
      });
    });
  };

  getProfilePicture = () => {
    let profilePicture = [];
    if (this.state.allVendors) {
      this.state.allVendors.forEach(vendor => {
        if (vendor.vendor_name === this.props.match.params.vendor) {
          profilePicture.push(vendor.profile_picture);
        }
      });
      return (
        <div className="profile-picture-container-div">
          <img
            className="profile-picture-through-client-page"
            src={profilePicture[0]}
            alt=""
          />
        </div>
      );
    } else {
      return null;
    }
  };

  getBusinessHours = () => {
    axios
      .get(`/api/business_hours/${this.props.match.params.vendor}`)
      .then(info => {
        this.setState({
          businessHours: info.data.data
        });
      });
  };

  getfoodItems = () => {
    getFoodItemsByVendor(this.props.match.params.vendor).then(items => {
      this.setState({
        foodInfo: items.data.food_items
      });
    });
  };

  getFavs = () => {
    axios
      .get(
        `/api/favorites/${this.props.match.params.vendor
          .split("%20")
          .join(" ")}`
      )
      .then(data => {
        this.setState({
          allFavsForVendor: data.data.favorites
        });
      })
      .then(() => {
        this.isFav();
      });
  };

  isFav = () => {
    let results = this.state.allFavsForVendor.filter(fav => {
      let answer = !!this.state.businessHours.length
        ? this.state.businessHours[0].vendor_id
        : 0;
      return (
        fav.vendor_id === answer && fav.client_id === this.props.currentUser.id
      );
    });

    this.setState({
      isFav: results
    });
  };

  addFav = async () => {
    await axios.post("/api/favorites/", {
      client_id: this.props.currentUser.id,
      vendor_id: this.state.businessHours[0].vendor_id
    });
    await this.getFavs();
  };

  deleteFav = async () => {
    await axios.delete(`/api/favorites/${this.state.isFav[0].id}`);

    await this.getFavs();
  };

  displayUnclaimedItems = () => {
    let unclaimedItems = this.state.foodInfo.filter(item => {
      return item.is_claimed === false;
    });
    let unclaimedList = unclaimedItems.map(item => {
      let converted_time = Number(item.set_time.slice(0, 2));
      console.log("time", converted_time, "item", item.name);
      return (
        <div
          key={item.food_id}
          className="vendor-profile-container-vendor-version"
        >
          <div className="claimed-vendor-items-two">
            <p className="vendor-page-item-name">{item.name}</p>
            <p className="vendor-page-item-pounds">
              {item.quantity * 3} pounds
            </p>
            <p className="vendor-page-item-quantity">{item.quantity} people </p>

            <h5 className="vendor-page-pickup-time">
              {converted_time < 13 && converted_time !== 0
                ? converted_time + "am"
                : converted_time === 0
                ? 12 + "am"
                : converted_time - 12 + "pm"}
            </h5>
            <Button
              id={item.food_id}
              onClick={e => this.claimItem(e, item.is_claimed)}
              variant="contained"
              color="secondary"
              className={
                item.is_claimed ? "claimed-button" : "unclaimed-button"
              }
            >
              {item.is_claimed ? "UNAVAILABLE" : "AVAILABLE"}
            </Button>
          </div>
        </div>
      );
    });
    return (
      <>
        <div className="display-donations-list-name">
          <h3 className="donation-list-text"> Donation List </h3>
        </div>
        <div className="vendor-items-list-header-vendor-view-through-client">
          <h4 className="vendor-profile-thru-client-item-name">Food Item </h4>
          <h4 className="vendor-profile-thru-client-weight">Weight </h4>
          <h4 className="vendor-profile-thru-client-feeds">Feeds</h4>
          <h4 className="vendor-profile-thru-client-pick-up">Pick Up Time </h4>
          <div id="spacing" />
        </div>
        {unclaimedList}{" "}
      </>
    );
  };

  displayClaimedItems = () => {
    let claimedItems = this.state.foodInfo.filter(item => {
      return item.is_claimed === true;
    });
    let claimedList = claimedItems.map(item => {
      let converted_time = Number(item.set_time.slice(0, 2));
      return (
        <div
          key={item.food_id}
          className="vendor-profile-container-vendor-version"
        >
          <div className="claimed-vendor-items-two">
            <h3>{item.name}</h3>
            <h5>{item.quantity} pounds</h5>

            <h5 className="vendor-page-pickup-time">
              {converted_time === 0 || converted_time < 13
                ? converted_time + "am"
                : converted_time - 12 + "pm"}
            </h5>
            <Button id={item.food_id} variant="contained" color="secondary">
              UNAVAILABLE
            </Button>
          </div>
        </div>
      );
    });
    return (
      <>
        <h3> Claimed Items History </h3>
        {claimedList}{" "}
      </>
    );
  };

  displayClaimedItems = () => {
    let claimedItems = this.state.foodInfo.filter(item => {
      return item.is_claimed === true;
    });
    let claimedList = claimedItems.map(item => {
      let converted_time = Number(item.set_time.slice(0, 2));
      return (
        <div
          key={item.food_id}
          className="vendor-profile-container-vendor-version"
        >
          <div className="claimed-vendor-items-two">
            <p className="vendor-page-item-name">{item.name}</p>
            <p className="vendor-page-item-pounds">
              {item.quantity * 3} pounds
            </p>
            <p className="vendor-page-item-quantity">{item.quantity} people </p>

            <p className="vendor-page-pickup-time">
              {converted_time === 0 || converted_time < 13
                ? converted_time + "am"
                : converted_time - 12 + "pm"}
            </p>
            <Button id={item.food_id} variant="contained" color="secondary">
              {item.is_claimed ? "UNCLAIM" : "TO CLAIM"}
            </Button>
          </div>
        </div>
      );
    });
    return <>{claimedList} </>;
  };
  displayVendorInfo = () => {
    return this.state.businessHours.map((time, i) => {
      let mon1 = Number(time.mon_start.slice(0, 2));
      let mon2 = Number(time.mon_end.slice(0, 2));
      let tue1 = Number(time.mon_start.slice(0, 2));
      let tue2 = Number(time.mon_end.slice(0, 2));
      let wed1 = Number(time.mon_start.slice(0, 2));
      let wed2 = Number(time.mon_end.slice(0, 2));
      let thu1 = Number(time.mon_start.slice(0, 2));
      let thu2 = Number(time.mon_end.slice(0, 2));
      let fri1 = Number(time.mon_start.slice(0, 2));
      let fri2 = Number(time.mon_end.slice(0, 2));
      let sat1 = Number(time.mon_start.slice(0, 2));
      let sat2 = Number(time.mon_end.slice(0, 2));
      let sun1 = Number(time.sun_start.slice(0, 2));
      let sun2 = Number(time.sun_end.slice(0, 2));
      return (
        <div
          className="main-div-displaying-detail-vendor-view-through-profile"
          key={i}
        >
          <h2 className="vendor-name">{time.name} </h2>
          {this.getProfilePicture()}
          <h5> {time.body} </h5>
          <br />
          <h2> Contact Us </h2>
          <h4 className="vendor-name">
            {time.address_field} <br />
            {time.telephone_number} <br />
            {time.email}
          </h4>

          <div className="businessHoursDiv" key={i}>
            <Button
              onClick={!!this.state.isFav.length ? this.deleteFav : this.addFav}
              variant="contained"
              color="secondary"
              className={
                !!this.state.isFav.length
                  ? "claimed-button"
                  : "unclaimed-button"
              }
            >
              {!!this.state.isFav.length
                ? "Remove From Favorites"
                : "Add To Favorites"}
            </Button>
            <h3>Business Hours</h3>
            <div className="inner-business-hours-div">
              <h5>
                {" "}
                <th>Monday: </th>
                <th className="table-spacer"> </th>
                <th>
                  {mon1 === 0 || mon1 < 13 ? mon1 + "am" : mon1 - 12 + "pm"}-
                  {mon2 === 0 || mon2 < 13 ? mon2 + "am" : mon2 - 12 + "pm"}{" "}
                </th>
              </h5>
              <h5>
                {" "}
                <th>Tuesday: </th>
                <th className="table-spacer"> </th>
                <th>
                  {tue1 === 0 || tue1 < 13 ? tue1 + "am" : tue1 - 12 + "pm"}-
                  {tue2 === 0 || tue2 < 13 ? tue2 + "am" : tue2 - 12 + "pm"}{" "}
                </th>
              </h5>
              <h5>
                {" "}
                <th>Wednesday: </th>
                <th className="table-spacer"> </th>
                <th>
                  {wed1 === 0 || wed1 < 13 ? wed1 + "am" : wed1 - 12 + "pm"}-
                  {wed2 === 0 || wed2 < 13 ? wed2 + "am" : wed2 - 12 + "pm"}{" "}
                </th>
              </h5>
              <h5>
                {" "}
                <th>Thursday: </th>
                <th className="table-spacer"> </th>
                <th>
                  {thu1 === 0 || thu1 < 13 ? thu1 + "am" : thu1 - 12 + "pm"}-
                  {thu2 === 0 || thu2 < 13 ? thu2 + "am" : thu2 - 12 + "pm"}{" "}
                </th>
              </h5>
              <h5>
                {" "}
                <th>Friday: </th>
                <th className="table-spacer"> </th>
                <th>
                  {fri1 === 0 || fri1 < 13 ? fri1 + "am" : fri1 - 12 + "pm"}-
                  {fri2 === 0 || fri2 < 13 ? fri2 + "am" : fri2 - 12 + "pm"}{" "}
                </th>
              </h5>
              <h5>
                {" "}
                <th>Saturday: </th>
                <th className="table-spacer"> </th>
                <th>
                  {sat1 === 0 || sat1 < 13 ? sat1 + "am" : sat1 - 12 + "pm"}-
                  {sat2 === 0 || sat2 < 13 ? sat2 + "am" : sat2 - 12 + "pm"}{" "}
                </th>
              </h5>
              <h5>
                {" "}
                <th>Sunday: </th>
                <th className="table-spacer"> </th>
                <th>
                  {sun1 === 0 || sun1 < 13 ? sun1 + "am" : sun1 - 12 + "pm"}-
                  {sun2 === 0 || sun2 < 13 ? sun2 + "am" : sun2 - 12 + "pm"}{" "}
                </th>
              </h5>
            </div>
          </div>
        </div>
      );
    });
  };

  claimItem = (e, isClaimed) => {
    isClaimed === true
      ? axios
          .patch(`/api/fooditems/claimstatus/${e.currentTarget.id}`, {
            client_id: null,
            is_claimed: false
          })
          .then(() => {
            this.getfoodItems();
          })
      : axios
          .patch(`/api/fooditems/claimstatus/${e.currentTarget.id}`, {
            client_id: this.props.currentUser.id,
            is_claimed: true
          })
          .then(() => {
            this.getfoodItems();
          });
  };

  render() {
    return (
      <div>
        <div className="vendor-profile-thru-client-main-page">
          <div className="inner-main-vendor-profile-thru-client-page">
            {this.displayVendorInfo()}
            <div className="divide-list-right">
              {this.displayUnclaimedItems()}
              {this.displayClaimedItems()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(VendorProfileThruClient);
