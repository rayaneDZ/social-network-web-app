const style = {
    outerdiv : {
        height : 100,
        width : '100%',
        display : 'flex',
        alignItems: 'center',
        justifyContent : 'center',
        backgroundColor: 'white',
        flexDirection : 'column'
    }
}

function Footer (){
    return (
        <div style={style.outerdiv}>
            <p style={{margin : 0}}>Website created by</p>
            <p style={{margin : 0}}>Rayane Bouthiba</p>
        </div>
    )
}

export default Footer
