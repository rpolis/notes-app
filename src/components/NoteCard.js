import React, { Component } from 'react';
//import XRegExp from XRegExp;
//import JSONPretty from 'react-json-pretty';;
import ReactJson from 'react-json-view'
class NoteCard extends Component {
  renderTags(note) {
    return note.tags.map((tag, index) => 
      <span className="note-card-tag" key={index}>
        {tag.name}
      </span>
    );

   
  }


  isValidJson = (json) => {
    try {
        JSON.parse(json);
        return true;
    } catch (e) {
        return false;
    }
}

generateModNote = () => {
  var text = this.props.note.content;
  var arr = []
  var modArray = [];
  try {
    arr = window.XRegExp.matchRecursive(text, '\\{', '\\}', 'gy');
    console.log(arr)
  }

  catch(err){
    console.log(err)
    modArray.push(<span>{text}</span>)

    return modArray;
    
  }
  
  var objarr = []
  var self = this;
  
  var toFit = 0 ;
  var toParse = []
  arr.forEach(element => {
    var json = "{" + element + "}";
    if(self.isValidJson(json)){
        var jsObj = JSON.parse(json);
        var toPush = {
                      "object":jsObj,
                      "index":text.indexOf(json),
                      "length" :json.length,                    
                    }

        objarr.push(toPush);
        
        
        
    }
});
var objarrlen = objarr.length;
var count = 0;
if(objarr.length == 0){
  modArray.push(<span>{text}</span>)

  return modArray;
}
objarr.forEach(element => {
var endIndex = element.index + element.length;
modArray.push(<span>{text.substring(toFit,element.index)}</span>)
modArray.push(<br />)
modArray.push(<ReactJson id="json-pretty" src={JSON.parse(text.substring(element.index,endIndex))}></ReactJson>)
count++;
toFit = endIndex + 1;
if(count == objarrlen){
  modArray.push(<span>{text.substring(toFit,text.length+1)}</span>)
}

})

return modArray;
}


  render() {``
    const { note, getNote, deleteNote } = this.props;
    var modArray = this.generateModNote()
    return(
      <div className="note-card-container">
        <div className="note-card-title">
          {note.title}
        </div>
        <div className="note-card-content">
          {modArray}
        </div>
        
       
        <span className="note-card-edit" onClick={() => getNote(note.id)}>
          <i className="material-icons">mode_edit</i>
        </span>
      </div>
    );
  }
}

export default NoteCard;