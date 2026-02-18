import React, { useState } from 'react';  
import { useNavigate } from 'react-router-dom';  
import { Button, Dropdown, Layout, Menu, theme } from 'antd';
import { GiHamburgerMenu } from 'react-icons/gi';    
import { HiDatabase  } from "react-icons/hi";     
import { SiCrehana } from "react-icons/si";
import { Outlet } from 'react-router-dom';  
import { SiMysql } from "react-icons/si";
import '@fortawesome/fontawesome-free/css/all.min.css'; 
import { MdInsertDriveFile   } from "react-icons/md";
import { TbPlugConnected } from "react-icons/tb"
import { BsFillEyeFill   } from "react-icons/bs";
import { TbReportAnalytics } from "react-icons/tb";
import { FaDiagramProject } from "react-icons/fa6";
import { SiOracle } from "react-icons/si";
import { SiCodefactor } from "react-icons/si";
import { LiaUserCircleSolid } from "react-icons/lia";
import { SiEnterprisedb } from "react-icons/si";   
import Sider from 'antd/es/layout/Sider';
import { Content, Header } from 'antd/es/layout/layout';
import { BiSolidFileExport } from 'react-icons/bi';
import { GrTransaction } from 'react-icons/gr';
import { PiSignOutThin } from "react-icons/pi";
import { AiOutlineDashboard } from 'react-icons/ai';
import { FaLink } from "react-icons/fa6";
import { ToastContainer } from 'react-toastify';
import { IoHomeOutline } from 'react-icons/io5';
import urls from '../../utils/base_url';
import { IoIosMenu } from "react-icons/io";
const items = [  
  {  
    key: '/',  
    icon: <img src="/home.png" alt="home" />,  
    label: 'Home',
  }, 
  { 
    key:'/project/manageprojects',
    icon: <img src="/project-sidebar.png" alt="project" />,   
    label: 'Project',
  },   
  // {  
  //   icon: <FaLink  className='fs-4' />,  
  //   label: 'Connections',
  //   children:[
  //     {
  //       key:'/connections',
  //       icon: <TbPlugConnected className='fs-4' />,  
  //       label: 'Create Connections',
  //       children:[ {  
  //         key: '/connections/Erp',  
  //         icon: <SiEnterprisedb  className='fs-4'/>,  
  //         label: 'ERP',  
  //       }, 
  //       {  
  //         key: '/connections/flatfile',  
  //         icon: <MdInsertDriveFile  className='fs-4' />,  
  //         label: 'Files',
  //       },    
  //       {  
  //         key:'/database',
  //         icon: <HiDatabase  className='fs-4' />,  
  //         label: 'Database',
  //         children:[
  //           {  
  //             key: '/connections/Hana',  
  //             icon: <SiCrehana  className='fs-4'/>,  
  //             label: 'HANA',  
  //           }, 
  //           {
  //             key: '/connections/MySql',
  //             icon: <SiMysql className='fs-4' />,  
  //             label: 'MySQL'
  //           },
  //           {
  //             key: '/connections/Oracle',
  //             icon: <SiOracle className='fs-4' />,  
  //             label: 'Oracle'
  //           }
  //           ]   
  //       }]
  //     },
  //     {
  //       key: '/connections/view-connections',
  //       icon: <BsFillEyeFill className='fs-4' />,  
  //       label: 'Manage Connections'
  //     },        
  //     {
  //       key: '/connections/manage/success-factors',
  //       icon: <SiCodefactor className='fs-4' />,  
  //       label: 'Success Factor'
  //     }        
  //   ]},
     {  
    key: '/connections/flatfile',  
       icon: <img src="/upload-sidebar.png" alt="upload" />,  
    label: 'Upload',
  },    
  // {
  //   key: '/reports',
  //   icon: <TbReportAnalytics className='fs-4' />,  
  //   label: 'Reports'
  // },
  {
    key : '/workspace',
     icon:<img src="/workspace-sidebar.png" alt="workspace" />,  
    label: 'My WorkSpace',
  }
];

const profileItems = [  
  {  
    key: '/username',  
    label: 'Karthik Aditya',
  },  
  {  
    key: '/signout',  
    icon: <PiSignOutThin /> ,  
    label: 'Sign Out',
  },  
];  

const MainScreen = () => 
 {  
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(true);  
  const [selectedKey, setSelectedKey] = useState('1'); // Add state for the selected key  
  const {  
    token: { colorBgContainer },  
  } = theme.useToken();  

  const handleMenuClick = (e) => {  
    setSelectedKey(e.key); 
    navigate(e.key);
  };  

  const returnHome = () => {
    navigate('/');
  }


  return (  
    <div>  
     <ToastContainer
      position='top-center' autoClose={2500} hideProgressBar={false} closeOnClick newestOnTop={true} rtl={false} pauseOnFocusLoss
      draggable  pauseOnHover theme='light'/>
      <Layout hasSider>  
        <Sider trigger={null} collapsible collapsed={collapsed} className='main-part sidebar' theme='dark' style={{maxWidth:"15px"}} width={"10px"}>  
          <div className={`logo_sidebar ${collapsed ? 'collapsed' : ''}`}>
            {!collapsed && <img src="/logo-sidebar.svg" alt="logo" className='sidebar-logo' />}
            {!collapsed && <Button
              type="text"
              icon={<img src="/sidebar-collapse.png" alt="collapse-icon" className='collapse-icon' />}
              onClick={() => setCollapsed(!collapsed)}
              className='collapse-icon'
            />

            }
            {collapsed && <Button
              type="text"
              icon={<IoIosMenu size={35} className='fs-5' color='#fff' />}
              onClick={() => setCollapsed(!collapsed)}
            // className='collapse-icon'
            />}
          </div>
          <div className="nav-menu">
          <Menu  
            theme="dark"  
            mode="inline"  
              className='sidebar-menu'
            selectedKeys={[selectedKey]}
            onClick={handleMenuClick} 
            items={items}  
          />  
          </div>
          <div className="user-profile">
            <div className="user-avatar">KA</div>
            {!collapsed && (
              <div className="user-info">
                <div className="user-name">Karthik Aditya</div>
                <div className="user-role">Super User</div>
              </div>
            )}
          </div>
        </Sider>  
        <Layout>  
          <Header style={{ padding: 0, maxHeight: "50px" }} className='d-flex justify-content-between ps-3 pe-5'>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: "100%" }}>
              <div>
                <img src='https://etimg.etb2bimg.com/photo/117021568.cms' className='rounded-circle' alt='logo' style={{ maxWidth:'90px' }} />
                {/* <Button
                  type="text"
                  icon={collapsed ? <GiHamburgerMenu /> : <GiHamburgerMenu />}
                  onClick={() => setCollapsed(!collapsed)}
                  style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                    marginLeft: collapsed ? '20px' : '165px' // Add some space between buttons
                  }}
                /> */}

              </div>
              <div>
                <Dropdown
                  overlay={
                    <Menu>
                      {profileItems.map(item => (
                        <Menu.Item key={item.key}>
                          {item.icon} {item.label}
                        </Menu.Item>
                      ))}
                    </Menu>
                  }
                  placement="bottomRight"
                  arrow
                >
                  {/* <LiaUserCircleSolid style={{ width: "30px", height: "30px", cursor: "pointer" }} /> */}
                  <img src="/setting.png" alt='Setting' className='cursor-pointer'/>
                </Dropdown>
              </div>
            </div>
          </Header>  
          <Content  
            style={{  
              // margin: '24px 16px',  
              // padding: 18,  
              overflowY:"scroll",  
              backgroundRepeat:"no-repeat",
              backgroundSize:"cover",
              backgroundColor:"#f9fafb",
              // backgroundImage: `url(${"https://www.yash.com/wp-content/themes/html5blank-stable/images/services/service-offeringBG.png"}`,  
            }}  
          >  
            <Outlet/>  
          </Content>  
        </Layout>  
      </Layout>  
    </div>     
  )    
};  

export default MainScreen;