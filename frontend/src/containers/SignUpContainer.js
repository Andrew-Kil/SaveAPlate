import SignUp from "../components/auth/SignUp.js";
import { connect } from "react-redux";
import { fetchAllUsers } from "../actions/UsersActions.js";
import { checkAuthenticateStatus } from "../actions/AuthActions.js";

const mapStateToProps = state => {
  return {
    users: state.users,
    currentUser: state.currentUser
  };
};

const mapDispatchToProps = dispatch => {
  return {
    fetchAllUsers: () => dispatch(fetchAllUsers()),
    checkAuthenticateStatus: () => dispatch(checkAuthenticateStatus())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
