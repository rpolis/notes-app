import React, { Component } from "react";
import "./App.css";
import Nav from "./components/Nav";
import List from "./components/List";
import Note from "./components/Note";
import axios from "axios";
import anotherUrlFor from "./helpers/anotherUrlFor";
import Flash from "./components/Flash";
import Sidebar from "./components/Sidebar";
import DynComponent from "./components/DynComponent";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      showNote: false,
      notes: [],
      note: {},
      newTag: false,
      error: "",
      boards: [],
      sharedboards: [],
      modalIsOpen: false,
      selectedBoard: null,
      currentComponent: null,
      isEdit: false
    };

    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  openModal() {
    this.setState({ modalIsOpen: true });
  }

  afterOpenModal() {
    // references are now sync'd and can be accessed.
    //this.subtitle.style.color = '#f00';
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  toggleNote = () => {
    this.setState({
      showNote: !this.state.showNote,
      note: {},
      isEdit: false
    });
  };

  handlePlusCLick = () => {
    this.setState({ currentComponent: "createboard", modalIsOpen: "true" });
  };

  handleShareClick = () => {
    this.setState({ currentComponent: "shareboard", modalIsOpen: "true" });
  };

  getBoards = () => {
    axios
      .get(anotherUrlFor("userboards/" + this.props.userId))
      .then(res => {
        this.setState({
          sharedboards: res.data.shared,
          boards: res.data.notShared,
          selectedBoard: res.data.notShared[0]
        });
        this.getNotes();
      })
      .catch(err => console.log(err));
  };

  addToBoards = board => {
    var boards = this.state.boards;
    board.notes = [];
    boards.push(board);
    this.setState({ boards: boards });
  };

  handleBoardClick = (board, type) => {
    this.setState({ selectedBoard: board }, () => {
      this.getNotes(type);
    });
  };

  getNotes = type => {
    if (!this.state.selectedBoard) return [];
    var selectedBoard = this.state.selectedBoard;
    var boards;
    if (type == true) {
      boards = this.state.sharedboards;
    } else {
      boards = this.state.boards;
    }

    var found = boards.find(function(board) {
      return board.id === selectedBoard.id;
    });

    this.setState({ notes: found["notes"] });
  };

  getNote = id => {
    // axios.get(anotherUrlFor(`notes/${id}`))
    // .then((res) => this.setState({note: res.data, showNote: true }) )
    // .catch((err) => console.log(err.response.data) );

    var found = this.state.notes.find(note => {
      return note.id === id;
    });
    if (found) this.setState({ note: found, showNote: true, isEdit: true });
  };

  performSubmissionRequest = (data, flag) => {
    if (flag) {
      return axios.post(anotherUrlFor(`editnotes`), data);
    }
    return axios.post(anotherUrlFor(`savenotes`), data);
  };

  submitNote = (data, flag) => {
    var self = this;
    if (!data) return;
    data.boardId = this.state.selectedBoard.id;
    data.owner = this.props.userId;
    this.performSubmissionRequest(data, flag)
      .then(res => {
        this.setState({ showNote: false });
        var note = res.data;
        var boards = this.state.boards;
        var found = this.state.boards.find(function(board) {
          return board.id === res.data.boardId;
        });

        if (!found) {
          found = this.state.sharedboards.find(function(board) {
            return board.id === res.data.boardId;
          });
        }
        var notesToModify;
        notesToModify = found.notes;
        var nextFind = notesToModify.find(function(fnote) {
          return fnote.id === res.data.id;
        });

        if (nextFind) {
          nextFind.content = note.content;
          nextFind.title = note.title;
          found.notes = notesToModify;
        } else {
          found.notes.push(note);
        }

        this.setState({ notes: found["notes"] });

        //notification

        var message;
        var subject;
        if (flag) {
          subject = "Note Update Notification";
          message = "The note with title '" + note.title + "' had been updated";
        } else {
          subject = "Note Creation Notification";
          message = "The note with title '" + note.title + "' had been created";
        }

        axios.get(anotherUrlFor(`boardUsers/${data.boardId}`)).then(res => {
          if (res.data) {
            var listOfEmails = [];

            res.data.forEach(element => {
              if (element.username !== self.props.userMail)
                listOfEmails.push(element.username);
            });

            var mailingdata = {
              toList: listOfEmails,

              subject: subject,

              text: message
            };
            axios.post(
              "http://a9e4534f91ded11e99de902c854f5752-1986348759.us-east-1.elb.amazonaws.com",
              mailingdata
            );
          }
        });
      })
      .catch(err => {
        const { errors } = err.response.data;
        if (errors.content) {
          this.setState({ error: "Missing Note Content!" });
        } else if (errors.title) {
          this.setState({ error: "Missing Note Title!" });
        }
      });
  };

  // deleteNote = id => {
  //   const newNotesState = this.state.notes.filter(note => note.id !== id);
  //   axios
  //     .delete(urlFor(`notes/${id}`))
  //     .then(res => this.setState({ notes: newNotesState }))
  //     .catch(err => console.log(err.response.data));
  // };

  showTagForm = () => {
    this.setState({ newTag: true });
  };

  closeTagForm = () => {
    this.setState({ newTag: false });
  };

  submitTag = (data, noteId) => {
    axios
      .post(anotherUrlFor(`savenotes`), data)
      .then(res => this.getNote(noteId))
      .catch(err => {
        const { errors } = err.response.data;
        if (errors.name) {
          this.setState({ error: "Missing Tag Name!" });
        } else if (errors.title) {
        }
      });
  };

  // deleteTag = (noteId, id) => {
  //   axios
  //     .delete(urlFor(`/tags/${id}`))
  //     .then(res => this.getNote(noteId))
  //     .catch(err => console.log(err.response.body));
  // };

  resetError = () => {
    this.setState({ error: "" });
  };

  render() {
    const {
      showNote,
      notes,
      note,
      newTag,
      error,
      boards,
      sharedboards,
      modalIsOpen,
      selectedBoard,
      currentComponent,
      isEdit
    } = this.state;

    return (
      <div className="App">
        <DynComponent
          tag={currentComponent}
          modalIsOpen={modalIsOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={this.closeModal}
          userId={this.props.userId}
          selectedBoard={selectedBoard}
          addToBoards={this.addToBoards}
        />
        <Nav toggleNote={this.toggleNote} showNote={showNote} />
        {error && <Flash error={error} resetError={this.resetError} />}
        <br />
        <div id="main_section">
          <Sidebar
            boards={boards}
            sharedboards={sharedboards}
            getBoards={this.getBoards}
            onBoardSelect={this.handleBoardClick}
            openModal={this.openModal}
            handlePlusCLick={this.handlePlusCLick}
            handleShareClick={this.handleShareClick}
          />
          {showNote ? (
            <Note
              note={note}
              newTag={newTag}
              submitNote={this.submitNote}
              showTagForm={this.showTagForm}
              closeTagForm={this.closeTagForm}
              submitTag={this.submitTag}
              deleteTag={this.deleteTag}
              isEdit={isEdit}
            />
          ) : (
            <List
              getNotes={this.getNotes}
              notes={notes}
              getNote={this.getNote}
              deleteNote={this.deleteNote}
              selectedBoard={selectedBoard}
            />
          )}
        </div>
      </div>
    );
  }
}

export default Home;
