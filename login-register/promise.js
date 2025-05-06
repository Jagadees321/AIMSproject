

let mypromise=new Promise((res,rej)=>{  
    let a=10;
    let b=20;
    setTimeout(()=>{
        if(a>b){
            res("resolved state");
        }else{
            rej("rejected state");
        }
    },5000);
}   
)
console.log(mypromise);



async function process(){   
    console.log("started");

    await mypromise.then((data)=>{
        console.log(data);
    }).catch((error)=>{
        console.log(error);
    })

    console.log('ended');
}
process();