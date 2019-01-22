import React, { Component } from 'react';
import Modal from 'react-modal';
import axios from 'axios';
import anotherUrlFor from '../helpers/anotherUrlFor';

class CreateBoardModal extends Component {
  constructor(props){
    super(props);
    this.state = {
      boardTitle : null
    }
  }

  onInputChange = (e) => {
    var value = e.target.value;
    this.setState({boardTitle:value})
   
  }
  createBoard  = () => {
 
    if(this.state.boardTitle){
      var boardTitle = this.state.boardTitle;
      var self  = this;
      axios.post(anotherUrlFor("saveboard"), {
        "title": boardTitle,
        "owner": this.props.userId
      })
      .then(function (response) {
        self.props.addToBoards(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    this.setState({boardTitle:null}) 
    this.props.onRequestClose()
  }

 
     
    render() {
        const {modalIsOpen,afterOpenModal,onRequestClose} = this.props;
        console.log(onRequestClose)
        return(  <Modal
            isOpen={modalIsOpen}
            onAfterOpen={afterOpenModal}
            onRequestClose={onRequestClose}
            style={{
              
            overlay:{
              height:'50%',
              width:'50%',
             'marginTop':'18%',
              'marginLeft':'21%',
              backgroundColor: 'white'
            },}}
            contentLabel="Example Modal"
          >
  
            <h2>Create Board</h2>
           
            
            <form>
              Enter Board Name :<input onChange ={(e) => this.onInputChange(e)}/>
              <button onClick={this.createBoard}>create</button>
            </form>
            <button onClick={onRequestClose}>cancel</button>
          </Modal>
          )
      
    }
}
export default CreateBoardModal;