import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';



function Square (props) {
      {
        console.log(props.isSelected);
        const nonSelected=<button className="square"onClick={props.onClick}>
        {props.value}  
        </button>;

        const select=
        <button className="square select"onClick={props.onClick}>
        {props.value}  
        </button>;

        const posibleMov=<button className="square posible"onClick={props.onClick}>
        {props.value}  
        </button>;

        const component=props.isSelected?select:props.posible?posibleMov:nonSelected;
    return (
    component    
    )
  }
  
}

class Board extends React.Component {
  *generador(){
    let i=0;
    while(true){
      yield i++;
    }
  }

  constructor(props){
    super(props);
    
  }

  renderSquare(key,value,x,y,isSelected,posible) {    
    return <Square
      key={key}
      value={value}
      onClick={()=>this.props.onClick(x,y)}
      isSelected={isSelected}
      posible={posible}
      />;
  }
  

  render() {
    const status = 'Next player: X';    
    const  currentBoard= this.props.currentBoard;
    const generador=this.generador();
    const boardComponent=currentBoard.map((fila,index)=>{
      const columna=fila;      
      const columnaComponent=columna.map((e,y)=>{        
        const key=generador.next().value;
        const currentFicha=this.props.currentFicha;
        const isSelectedThisFicha=index===currentFicha.posX &&
                                   y===currentFicha.posY &&
                                       currentFicha.ficha;        
        const posiblesMov=currentFicha.posibleMov;
        
        
        if (isSelectedThisFicha) {          
          return this.renderSquare(key,e,index,y,true)  
        }        
          
        if (posiblesMov) {
          const currrentPosibleMov=posiblesMov.filter((e,i)=>e.x===index&&e.y===y);         
          if (currrentPosibleMov[0] ) {            
            return this.renderSquare(key,e,index,y,false,true)  
          }          
        }
        return this.renderSquare(key,e,index,y,false)        
      });
      return <div className="board-row" key={index} >
        {columnaComponent}
      </div>
    });
    
    return (
      <div>
        {boardComponent}        
      </div>
    );
  }
}

class Game extends React.Component {
  
  

  constructor(props){
    super(props);
    const board=this.initGame()
     this.state={
       boardsHistory:[{board:board},],
       currentGame:0,       
       currentFicha:{ficha:null,
                    posX:0,posY:0},       
     }
     
  }

  initGame(){
    const board=Array(8).fill(null);
    const boardFull=board.map(e=>Array(8).fill(null));
    boardFull[0][0]='r';
    boardFull[0][1]='n';
    boardFull[0][2]='b';
    boardFull[0][4]='k';
    boardFull[0][3]='q';
    boardFull[0][5]='b';
    boardFull[0][6]='n';
    boardFull[0][7]='r';
    boardFull[7][0]='R';
    boardFull[7][1]='N';
    boardFull[7][2]='B';
    boardFull[7][4]='K';
    boardFull[7][3]='Q';
    boardFull[7][5]='B';
    boardFull[7][6]='N';
    boardFull[7][7]='R';
    for(let i=0;i<8;i++){
      boardFull[1][i]='p';
      boardFull[6][i]='P';
    }
    return boardFull;  
    
  }

  handleClick(x,y){
    const currentGame=this.state.currentGame; 
    const currentBoard=this.state.boardsHistory[currentGame].board.slice();        
    const ficha=currentBoard[x][y];
    const currentFicha=this.state.currentFicha.ficha;
    const isFirstPickEmpySpace=!ficha && !currentFicha;    
    if (isFirstPickEmpySpace) {
      return;
    } 
    else if (ficha) {    
      const posibleMov=this.legalMoves(ficha,x,y);     
      console.log(posibleMov);   
      this.setState({currentFicha:{
        ficha:ficha,
        posX:x,posY:y,
        posibleMov:posibleMov
      }});         
    } else if (!ficha && currentFicha) {        
      this.moveFichaTo(x,y,this.state.currentFicha);
      this.setState({currentFicha:{ficha:null,posX:0,posY:0}})
    } 
  }

  isLegalThisMove(){
    const currrentFicha=this.state.currentFicha
  }
  
  legalMoves(ficha,x,y){
    const posibleMov=[];          
    const isFichaBlack=ficha===ficha.toUpperCase();
    const isPeon=ficha.toLowerCase()==='p';    
    if (isFichaBlack && isPeon) {      
     const legalMoves= posibleMov.concat([{x:x-1,y:y}]);  
      return legalMoves;	
    }else{      
      const legalMoves=  posibleMov.concat([{x:x+1,y:y}]);
      return legalMoves;	
    }    
  }

   moveFichaTo(x,y,{ficha,posX,posY}){
    const boardsHistory=this.state.boardsHistory.slice();
    const currentGame=this.state.currentGame;       
    const currentBoard=this.state.boardsHistory[currentGame].board.slice();        
    currentBoard[posX][posY]=null;
    currentBoard[x][y]=ficha;
    this.setState({
      boardsHistory:boardsHistory.concat({board:currentBoard}),
      currentGame:this.state.currentGame++
    });      
   }

  render() {    
    return (
      <div className="game">
        <div className="game-board">          
          <Board
          currentBoard={this.state.boardsHistory[this.state.currentGame].board}
          onClick={(x,y)=>this.handleClick(x,y)}
          currentFicha={this.state.currentFicha}
                    
    />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
