import React, { useEffect, useState } from 'react';  
import { Tabs } from 'antd';  
import PreLoadWorkSpace from './PreLoad_WorkSpace';
import PreLoad_WorkSpace from './PreLoad_WorkSpace';
import PreLoad_Pivot from './PreLoad_Pivot';

const PreLoadLayout = () => {  
  const current_tab = '1';
//   const current_tab = localStorage.getItem('current_tab') ? localStorage?.getItem('current_tab') : '1';
  const [key,setKey] = useState(current_tab); 

  // useEffect(()=>{
  //       const handleBeforeUnload = (event) => {
  //           event.preventDefault();
  //           event.returnValue = "Are you sure you want to leave?";
  //       };
  //       window.addEventListener('beforeunload', handleBeforeUnload);
  //       return () => {
  //           window.removeEventListener('beforeunload', handleBeforeUnload);
  //       };
  //   },[]);
  
  const onChange = (key) => {  
    setKey(key) 
    // localStorage.setItem('current_tab', key);
  };  
  const workspacesData = [  
    {  
      id: "1",  
      label: "PreLoad",  
      children: <PreLoad_WorkSpace setKey={onChange}/>,  
    },  
    {  
      id: "2",  
      label: "Pivot",  
      children: <PreLoad_Pivot setKey={onChange}/>,  
    },   
    // {  
    //   id: "3",  
    //   label: "EDA",  
    //   children: <Reports setKey={onChange}/>,  
    // }, 
    // {  
    //   id: "4",  
    //   label: "Preload",  
    //   children: <PreLoadWorkSpace setKey={onChange}/>,  
    // },
    // {
    //   id : '5',
    //   label : "Postload",
    //   children : <PostLoadWorkSpace setKey={onChange}/>
    // },   
    // {
    //   id : '6',
    //   label : "Errors",
    //   children : <Errors_WorkSpace setKey={onChange}/>
    // }   
  ];

  return (  
    <Tabs  
      defaultActiveKey={"1"} 
      activeKey={key}
      onChange={onChange}  
      type="card"  
      className='p-1'
      items={workspacesData.map(({ id, label, children }) => ({  
        key: id, 
        label: label,   
        children: children,
      }))}  
    />  
  );  
};  

export default PreLoadLayout;  