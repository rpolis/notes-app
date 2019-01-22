import React, { Component } from "react";
import plus from "../images/plus.png";
import minus from "../images/minus.png";
import shareIcon from "../images/shareicon.png";
import axios from "axios";
import { ListGroupItem, ListGroup } from "react-bootstrap";

class Sidebar extends Component {
  componentWillMount() {
    this.props.getBoards();
  }

  handleShareClick = () => {
    console.log("share");
  };

  //style = {{display:"flex"
  render() {
    const {
      boards,
      sharedboards,
      getBoards,
      onBoardSelect,
      handlePlusCLick,
      handleShareClick
    } = this.props;
    const listItems = boards.map((d, index) => (
      <ListGroupItem
        key={d.id}
        onClick={e => onBoardSelect(boards[index], false, e)}
      >
        <img
          src={shareIcon}
          className="sidebarIcons"
          onClick={handleShareClick}
          height="20px"
          width="20px"
        />
        {d.title}
      </ListGroupItem>
    ));
    var sharedlistItems;
    if (sharedboards) {
      sharedlistItems = sharedboards.map((d, index) => (
        <ListGroupItem
          key={d.id}
          onClick={e => onBoardSelect(sharedboards[index], true, e)}
        >
          {d.title}
        </ListGroupItem>
      ));
    } else {
      sharedlistItems = [];
    }

    return (
      <div className="sidebar">
        <div id="sidebarHead">
          <h4>My Boards</h4>
          <img
            src={plus}
            className="sidebarIcons"
            onClick={handlePlusCLick}
            height="24px"
            width="24px"
          />
        </div>

        <ListGroup>{listItems}</ListGroup>
        <div id="sidebarHead">
          <h4>Shared Boards</h4>
        </div>
        <ListGroup>{sharedlistItems}</ListGroup>
      </div>
    );
  }
}

export default Sidebar;
