import React, { Component } from "react";
import Modal from "react-modal";
import axios from "axios";
import anotherUrlFor from "../helpers/anotherUrlFor";

class ShareBoardModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersToShare: []
    };
  }

  onInputChange = e => {
    var value = e.target.value;
    var arrOfUsers = value.split(",");
    this.setState({ usersToShare: arrOfUsers });
  };
  shareBoard = () => {
    if (this.state.usersToShare.length > 0) {
      var usersToShare = this.state.usersToShare;
      var self = this;
      axios
        .post(anotherUrlFor("shareboard"), {
          boardId: this.props.selectedBoard.id,
          email: usersToShare[0]
        })
        .then(function(response) {
          alert("Board has been shared");
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    this.setState({ usersToShare: [] });
    this.props.onRequestClose();
  };

  render() {
    const { modalIsOpen, afterOpenModal, onRequestClose } = this.props;
    console.log(onRequestClose);
    return (
      <Modal
        isOpen={modalIsOpen}
        onAfterOpen={afterOpenModal}
        onRequestClose={onRequestClose}
        style={{
          overlay: {
            height: "50%",
            width: "50%",
            marginTop: "18%",
            marginLeft: "21%",
            backgroundColor: "white"
          }
        }}
        contentLabel="Example Modal"
      >
        <h2>Share Board</h2>

        <form>
          Enter Usernames :<input onChange={e => this.onInputChange(e)} />
          <button onClick={this.shareBoard}>share</button>
        </form>
        <button onClick={onRequestClose}>cancel</button>
      </Modal>
    );
  }
}
export default ShareBoardModal;
