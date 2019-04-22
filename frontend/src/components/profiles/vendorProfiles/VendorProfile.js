import React, { Component } from "react";
import axios from "axios";
import { getFoodItemsByVendor } from "../../../utils/UtilFoodItems.js";
import AddItemForm from "./AddItemsForm.js";
import "./vendorProfilesCSS/vendorProfile.css";

class VendorProfile extends Component {
  constructor() {
    super();
    this.state = {
      quantity: "",
      name: "",
      set_time: "",
      toAddItem: false,
      claimedItems: [],
      unclaimedItems: []
    };
  }

  componentDidMount() {
    this.vendorDonations();
  }

  // Add food items
  addItemButton = () => {
    return (
      <button onClick={this.toAddItem} className="add-item-button">
        {" "}
        Add Item{" "}
      </button>
    );
  };

  toAddItem = () => {
    this.setState({
      toAddItem: !this.state.toAddItem
    });
  };

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  };

  submitItem = e => {
    e.preventDefault();
    const { quantity, name, set_time } = this.state;
    axios
      .post("/api/fooditems/", {
        quantity: quantity,
        name: name,
        set_time: set_time,
        vendor_id: this.props.currentUser.id
      })
      .then(() => {
        this.vendorDonations();
      });
  };

  // Get items
  vendorDonations = () => {
    let tempVar;
    if (this.props.currentUser.type === 2) {
      tempVar = this.props.match.params.vendor;
    }
    console.log(tempVar);
    getFoodItemsByVendor(!tempVar ? this.props.currentUser.name : tempVar).then(
      data => {
        let unclaimed = data.data.food_items.filter(item => {
          return item.is_claimed === false;
        });

        this.setState({
          unclaimedItems: unclaimed
        });
        let claimed = data.data.food_items.filter(item => {
          return item.is_claimed === true;
        });
        this.setState({
          claimedItems: claimed
        });
      }
    );
  };

  // Display items
  displayUnclaimedItems = () => {
    return this.state.unclaimedItems.map(item => {
      let converted_time = Number(item.set_time.slice(0, 2));

      return (
        <div key={item.food_id} id="display-unclaimed-items">
          <h4 id="item-name">{item.name}</h4>
          <p>{item.quantity} pounds</p>
          <p>Feeds: {item.quantity * 3} people</p>
          <p>
            {" "}
            Lastest Pick Up Time: {""}
            {converted_time === 0 || converted_time < 13
              ? converted_time + "am"
              : converted_time - 12 + "pm"}
          </p>
          <div>
            {item.is_claimed ? (
              <button
                onClick={e => this.claimItem(e, item.is_claimed)}
                id="claimed-button">
                Claimed
              </button>
            ) : (
              <button
                onClick={e => this.claimItem(e, item.is_claimed)}
                id="unclaimed-button">
                Unclaimed
              </button>
            )}
          </div>
          <button onClick={this.deleteItem} id="delete-button">
            <img
              id={item.food_id}
              src="https://cdn1.iconfinder.com/data/icons/round-ui/123/47-512.png"
              alt=""
              height="25"
              width="25"
            />
          </button>
        </div>
      );
    });
  };

  displayClaimedItems = () => {
    return this.state.claimedItems.map(item => {
      let converted_time = Number(item.set_time.slice(0, 2));

      return (
        <div key={item.food_id} id="display-claimed-items">
          <h4 id="item-name">{item.name}</h4>
          <p>{item.quantity} pounds</p>
          <p>Feeds: {item.quantity * 3} people</p>
          <p>
            {" "}
            Lastest Pick Up Time: {""}
            {converted_time === 0 || converted_time < 13
              ? converted_time + "am"
              : converted_time - 12 + "pm"}
          </p>
          <div>
            {item.is_claimed ? (
              <button
                onClick={e => this.claimItem(e, item.is_claimed)}
                id="claimed-button">
                Claimed
              </button>
            ) : (
              <button
                onClick={e => this.claimItem(e, item.is_claimed)}
                id="unclaimed-button">
                Unclaimed
              </button>
            )}
          </div>
          <button onClick={this.deleteItem} id="delete-button">
            <img
              id={item.food_id}
              src="https://cdn1.iconfinder.com/data/icons/round-ui/123/47-512.png"
              alt=""
              height="25"
              width="25"
            />
          </button>
        </div>
      );
    });
  };

  // To claim on vendor page
  claimItem = (e, isClaimed) => {
    if (this.props.currentUser.type) {
      axios
        .patch(`/api/fooditems/claimstatus/${e.target.id}`, {
          client_id: this.props.currentUser.id,
          is_claimed: !isClaimed
        })
        .then(() => {
          this.vendorDonations();
        });
    }
  };

  // Delete items
  deleteItem = e => {
    axios.delete(`/api/fooditems/${e.target.id}`).then(() => {
      this.vendorDonations();
    });
  };

  // Favorite vendor
  render() {
    let vendorUser;
    if (this.props.currentUser.type === 2) {
      vendorUser = this.props.match.params.vendor;
    }
    console.log(this.state);
    return (
      <div className="vendor-profile-container">
        <h1 className="vendor-name">
          {" "}
          {!vendorUser ? this.props.currentUser.name : vendorUser}{" "}
        </h1>
        <br />
        <div id="vendor-people-fed">
          Number of people fed:
          <p>0</p>
        </div>
        <br />
        <br />
        {this.state.toAddItem ? (
          <AddItemForm
            handleChange={this.handleChange}
            submitItem={this.submitItem}
          />
        ) : (
          this.addItemButton()
        )}
        <br />
        <div>
          <h1 id="donation-list">Donation List</h1>
          <div id="display-unclaimed-items-container">
            {this.displayUnclaimedItems()}
          </div>
        </div>
        <div>
          <h1 id="claimed-items-list">Claimed Items</h1>
          {this.displayClaimedItems()}
        </div>
      </div>
    );
  }
}

export default VendorProfile;
