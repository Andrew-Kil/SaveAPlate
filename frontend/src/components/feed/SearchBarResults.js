import React from "react";
import { Link } from "react-router-dom";
import SearchBarResultsVendorDisplay from "./SearchBarResultsVendorDisplay.js";
import SearchBarResultsVendorItemsDisplay from "./SearchBarResultsVendorItemsDisplay.js";
import Button from "@material-ui/core/Button";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import green from "@material-ui/core/colors/green";
import "./feedCSS/SearchBarResults.css";

// will need to apply the search object filter here just like all the others to get it to work to group
export const SearchBarResults = props => {
  let searchDataObj = {};
  let converted_time;
  if (props.userSearchResults.length > 0) {
    let searchResults = props.userSearchResults.filter(result => {
      return result.is_claimed !== true;
    });
    searchResults.map((results, i) => {
      if (!searchDataObj[results.vendor_name]) {
        searchDataObj[results.vendor_name] = [results];
      } else if (searchDataObj[results.vendor_name]) {
        searchDataObj[results.vendor_name].push(results);
      }
      converted_time = Number(results.set_time.slice(0, 2));
    });
    let vendorNameArr = Object.keys(searchDataObj);

    let vendorName = vendorNameArr.map((vendorName, a) => {
      return (
        <div key="a">
          <SearchBarResultsVendorDisplay vendorName={vendorName} />

          <div className="vendorItemsWrapper">
            {searchDataObj[vendorName].map((food, b) => {
              return (
                <div className="vendorItemsContainer" key={b}>
                  <SearchBarResultsVendorItemsDisplay
                    food={food}
                    claimItem={props.claimItem}
                    receivedOpenSnackbar={props.receivedOpenSnackbar}
                    converted_time={converted_time}
                    theme={theme}
                  />
                </div>
              );
            })}
          </div>
        </div>
      );
    });
    return vendorName;
  }
};

const theme = createMuiTheme({
  palette: {
    primary: green,
    secondary: {
      main: "#5cbc5c"
    }
  },
  typography: {
    useNextVariants: true
  }
});
