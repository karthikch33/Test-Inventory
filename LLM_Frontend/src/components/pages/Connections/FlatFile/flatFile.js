import React, { useEffect, useState } from 'react';  
import { Input, Table, Button, Radio, message, Space, Tooltip} from 'antd';  
import {useFormik} from 'formik'
import * as yup from 'yup'
import { useDispatch, useSelector } from 'react-redux';
import { deleteFileSlice, getFileSlice, renameFileSlice } from '../../../features/Connections/fileSlice';
import { CustomSelectManageProjects } from '../../CustomSelect';
import { RiDeleteBinLine } from "react-icons/ri";
import  { CustomCreateFormFileModal, CustomDeleteModal, CustomRenameModal } from '../../CustomModal';
import Meta from '../../../utils/Meta';
const FlatFile = () => {  

    const {Search} = Input
 
    const [allProjects, setAllProjects] = useState([]);
    const [messageApi, contextHolder] = message.useMessage();
    const [filesData,setFilesData] = useState([]);
    const [partialFilesData,setPartialFilesData] = useState([]);
    const [selectProjectId,setSelectedProjectId] = useState(0);
    const [selectedRecord,setSelectedRecord] = useState(null);  
    const [openDeleteModal, setOpenDeleteModal] = useState(false);  
    const [openRenameModal, setOpenRenameModal] = useState(false);  
    const [openCreateModal, setOpenCreateModal] = useState(false);   

    const {projects} = useSelector(state => state.project);

    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getFileSlice())
        .then((response)=>{
            if(response?.payload?.status === 200)  loadFiles(response);
            else message?.error('Failed To Load Files')
        })
     }, []);

     useEffect(()=>{
        setAllProjects(projects);
    },[projects])         
 
    const schema = yup.object({
        file_name : yup  
                .string()  
                .required("File Name is required")  
                .matches(  
                    /^[a-zA-Z_.-]+$/,  
                    'File name can only contain letters, underscores, periods, and hyphens.'  
                )  
                .trim()  
                .notOneOf(['.', '', '_', '-'], 'File name cannot be just a dot, underscore, or hyphen.')  
                .test('no-start-end-dot', 'File name cannot start or end with a dot.', (value) => {  
                    return value && !(value.startsWith('.') || value.endsWith('.'));  
                })  
                .test('no-start-end-hyphen', 'File name cannot start or end with a hyphen.', (value) => {  
                    return value && !(value.startsWith('-') || value.endsWith('-'));  
                })  
                .test('no-start-end-underscore', 'File name cannot start or end with an underscore.', (value) => {  
                    return value && !(value.startsWith('_') || value.endsWith('_'));  
                })  
                .test('no-spaces', 'Spaces are not allowed in file name.', (value) => {  
                    return value && !/\s/.test(value);  
                }),
    })
   
    const formik = useFormik({
      initialValues:{
          file_name:""
      },
      validationSchema:schema,
      onSubmit : ()=>{
        handleRename();
        formik.resetForm();
      }
  })
 
    const columns = [  
        {  
            title: 'File Name',  
            dataIndex: 'file_name',  
            key: 'file_name',  
        },
        {
            title : 'CDS Name',
            dataIndex : 'cds_name',
            key : 'cds_name'
        },
        {
            title : 'Uploaded On',
            dataIndex : 'created_at',
            key : 'created_at'
        },
        {
            title : 'Uploaded By',
            dataIndex : 'created_by',
            key : 'created_by'
        },
        {
            title : 'Actions',
            key : 'actions',
            render : (_, record) => (
                <Space className="justify-content-center">
                    <Tooltip title="Delete">
                        <Button
                            type="text"
                            danger
                            icon={<RiDeleteBinLine className='fs-5' />}
                            onClick={() => handleActionDelete(record)}
                        />
                    </Tooltip>
                </Space>
            )
        }
    ];

    const handleActionDelete = (record)=>{
        setOpenDeleteModal(true);
        setSelectedRecord(record);
    }

    const formatDateString = (isoDate) => {
        const date = new Date(isoDate);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    }

    const loadFiles = (response)=>{
        const updatedColumnsData = []
        const loadedFiles = response?.payload?.data;
        console.log(loadedFiles);

        loadedFiles?.forEach((field,i)=>{
            updatedColumnsData?.push({
                file_id : field?.file_id, // ask id from backend
                file_name : field?.file_name,
                project_id : field?.project_id,
                cds_name :field?.cds_name,
                created_at : formatDateString(field?.created_time),
                created_by : 'aditya'
            })
        })

        
        let filteredProjects
        if(selectProjectId)
        {
            const project_id = Number(selectProjectId);
            filteredProjects = updatedColumnsData?.filter(item => item?.project_id === project_id);
        }
        else filteredProjects = updatedColumnsData

        setPartialFilesData(updatedColumnsData);
        setFilesData(filteredProjects);
    }

    const handleSearch = (e)=>{
        let filteredData = []
        if(selectProjectId)
        {
            filteredData = partialFilesData?.filter(item => (
            item?.project_id === selectProjectId && (
                item?.file_name?.toLowerCase()?.includes(e?.toLowerCase()) || item?.file_type?.toLowerCase()?.includes(e?.toLowerCase()) ||
                item?.table_name?.toLowerCase()?.includes(e?.toLowerCase()) ||item?.sheet?.toLowerCase()?.includes(e?.toLowerCase()) )
            ))
        }
        else{
            filteredData = partialFilesData?.filter(item => (
                item?.file_name?.toLowerCase()?.includes(e?.toLowerCase()) || item?.file_type?.toLowerCase()?.includes(e?.toLowerCase()) ||
                item?.table_name?.toLowerCase()?.includes(e?.toLowerCase()) ||item?.sheet?.toLowerCase()?.includes(e?.toLowerCase()) )
            )
        }
        setFilesData(filteredData);
    }

    const handleSearchChange = (e)=>{
        if(!e?.target?.value){
            let filteredProjects = []
            const project_id = Number(selectProjectId);
            if(project_id) filteredProjects = partialFilesData?.filter(item => item?.project_id === project_id);
            else filteredProjects = partialFilesData
            setFilesData(filteredProjects);
        }
    }

    const handleProjectSelect = (e)=>{
        setSelectedProjectId(Number(e));
        if(e)
        {
            const project_id = Number(e);
            const filteredProjects = partialFilesData?.filter(item => item?.project_id === project_id);
            setFilesData(filteredProjects);
        }
        else setFilesData(partialFilesData);
        setSelectedRecord(null);
    }

    const handleFileCreate = () => {
        setOpenCreateModal(true);
    }

    const hideCreateModal = () => {
        setOpenCreateModal(false);
      }


    const hideDeleteModal = () => {  
        setOpenDeleteModal(false); 
    };
   
    // const handleFileRename = () => {  
    //     if(selectedRecord === null){
    //         if(alertActive){
    //             messageApi.info('Please Select a File')
    //             setAlertActive(false);
    //             setTimeout(()=>setAlertActive(true),3000);
    //         }
    //     }
    //     else{
    //     formik?.setFieldValue('file_name',selectedRecord?.file_name);
    //     setOpenRenameModal(true);
    //     }
    // };  

    const hideRenameModal = () => {  
        setOpenRenameModal(false);  
        formik.resetForm();
    }; 
    
    
    const handleDelete = ()=>{
        dispatch(deleteFileSlice(selectedRecord))
        .then((response)=>{
            console.log(response);
            if(response?.payload?.status === 200){
                messageApi?.success(`${response?.payload?.data} has been deleted`)
            }
            else{
                messageApi?.error(`${response?.payload?.data} deletion failed`)
            }
        })
        .finally(()=>{
            setSelectedRecord(null);

            dispatch(getFileSlice())
            .then((response)=>{
                if(response?.payload?.status === 200) loadFiles(response);
                else message?.error('Fetching Files Failed')
            })
            hideDeleteModal();
         })

    }
 
    const handleRename = ()=>{
        const rename_data = {
            re_val : formik?.values?.file_name,
            ...selectedRecord
        }
        dispatch(renameFileSlice(rename_data))
        .then((response)=>{
            if(response?.payload?.status === 200){
                messageApi?.success(`${response?.payload?.data} is renamed`)
            }
            else{
                messageApi.error(`${formik?.values?.file_name} failed to rename`)
            }
        })
        .finally(()=>{
            setSelectedRecord(null);

            dispatch(getFileSlice())
            .then((response)=>{
            if(response?.payload?.status === 200)  loadFiles(response);
            else message?.error('Fetching Files Failed')
            })

            hideRenameModal();
        })
    }  
 
    return (  
      <>
      <Meta title="Manage Files"/>
        <div className="w-100 p-4">  
            {contextHolder}    
            <div className="d-flex justify-content-between align-items-center mb-2" style={{ overflowX: "auto"}}>
            <div className='d-flex'>  
            <label style={{fontSize: "30px",fontWeight : "600",marginLeft:"20px",marginRight: "20px",whiteSpace: "nowrap"}}> Files </label>   
            <CustomSelectManageProjects value={selectProjectId} handleChange={handleProjectSelect} projects={allProjects}/>
            </div>  
            <div className='d-flex mx-4 gap-3'>
            {/* <Button onClick={''} style={{ fontSize: '14px', marginRight:"10px" }}>  Reupload  </Button>   */}
             <div className='search-box me-4'>
                <Search  
                prefix={<img src="/search.png" alt="Search" style={{ width: "20px", height: "20px" }} />}
                placeholder="Search by File Name, File Type, Table Name, or Sheet"  
                onSearch={(e) => handleSearch(e)}  
                onChange={(e) => handleSearchChange(e)}  
                style={{ minWidth: "300px", maxWidth: "300px", marginRight: "10px", marginBottom: "1px", maxHeight: "32px" }} />
            </div>
            <Button
                className='primary new-project-btn' 
                style={{ fontSize: '14px' }}
                onClick={handleFileCreate}
                icon={<img src="/plus-icon.png" alt="" style={{ width: "20px", height: "20px" }} />} 
                >
                    New File  
            </Button>
            </div>
            </div>
            <Table className='flatFile' columns={columns} dataSource={filesData} pagination={{ pageSize: 10}} style={{overflowX:"auto",marginTop:"10px"}}/>  
            <CustomCreateFormFileModal openCreateModal={openCreateModal} hideCreateModal={hideCreateModal} loadFiles={loadFiles}/>
 
            <CustomDeleteModal
            title={<>Delete { selectedRecord?.file_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>"
            {` `} {selectedRecord?.file_name}{` `} "</span>:''} {` `}Connection</>} hideModal={hideDeleteModal} open={openDeleteModal}
            performAction = {handleDelete} onCancel={hideDeleteModal} okText="OK" cancelText="CANCEL"/>
            
            <CustomRenameModal  title={<>Rename { selectedRecord?.file_name !== undefined ?  <span style={{ color: "red",display:"inline" }}>
            "{` `} {selectedRecord?.file_name}{` `} "</span>:''} {` `}Connection</>} open={openRenameModal} onSubmit={formik?.handleSubmit}
            hideModal={hideRenameModal} value={formik?.values?.file_name} name={"file_name"} handleChange={formik?.handleChange}
            blur={formik?.handleBlur} touched={formik?.touched?.file_name} error={formik?.errors?.file_name}/>
        </div>  
      </>
    );  
}  
 
export default FlatFile