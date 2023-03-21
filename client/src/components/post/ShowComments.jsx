const style = {
    margin : {
        margin : 0,
        marginRight : 15
    },
    button : {
        border : 'none',
        backgroundColor : 'white',
        padding : 0
    }
}

function ShowComments(props) {
  return (
      <button style={style.button} onClick={props.handler}><p style={{fontSize : 10}}>show comments</p></button>
  )
}

export default ShowComments
