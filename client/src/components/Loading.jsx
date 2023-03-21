function Loading() {
  return (
    <div style={{display : 'flex', justifyContent : 'center', alignItems : 'center', height : '100vh'}}>
        <div className="preloader-wrapper big active">
        <div className="spinner-layer spinner-blue-only">
            <div className="circle-clipper left">
            <div className="circle"></div>
            </div><div className="gap-patch">
            <div className="circle"></div>
            </div><div className="circle-clipper right">
            <div className="circle"></div>
            </div>
        </div>
        </div>
    </div>
  )
}

export default Loading
