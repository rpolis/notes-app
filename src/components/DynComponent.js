import React, { Component } from 'react';
import CreateBoardModal from './CreateBoardModal';
import ShareBoardModal from './ShareBoardModal';
class DynComponent extends Component {
    components = {
        createboard: CreateBoardModal,
        shareboard: ShareBoardModal
    };
    render() {
       const TagName = this.components[this.props.tag || 'shareboard'];
       const {tag,modalIsOpen,onAfterOpen,onRequestClose,userId,selectedBoard,addToBoards} = this.props;
       console.log(this.props)
       return <TagName 
       modalIsOpen={modalIsOpen}
       onAfterOpen={onAfterOpen}
       onRequestClose={onRequestClose}
       userId = {userId}
       selectedBoard = {selectedBoard}
       addToBoards = {addToBoards}       
       />
    }
}
export default DynComponent;