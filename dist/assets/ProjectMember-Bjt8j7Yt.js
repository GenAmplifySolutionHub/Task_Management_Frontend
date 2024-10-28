import{f as q,m as W,n as $,a5 as j,o as Q,r as o,a as e,j as s,G as i,a6 as U,q as P,t as F,M as w,a7 as L,d as k,B as v,p as V,y as G,b as B,c as A,a8 as J,x as K,z as X,s as H,H as Z,J as z,K as O,Q as Y,U as ee,V as te,W as ne,X as ae,Z as re,_ as oe,a9 as le}from"./vendor-DSVVCEiu.js";import{S as se}from"./styles-k6wuRl1O.js";import{a as ie,g as ce,D as de,b as he}from"./index-CisOp6jH.js";const ue=c=>{const{fetchEmployees:d,onClose:b}=c,{id:I}=q(),t=W({initialValues:{Emp_Id:null,Role_Id:null,Degesination:""},validationSchema:$({Emp_Id:j().required("Employee is required"),Role_Id:j().required("Role is required"),Degesination:Q().required("Designation is required")}),onSubmit:async r=>{try{const{Emp_Id:a,Role_Id:p,Degesination:n}=r,h=await ie(Number(I),Number(a),Number(p),n);console.log(h),h&&h.success?(console.log("Success:",h.message),d(),b()):t.setFieldError("Emp_Id",h.message||"Unexpected response format. Please try again.")}catch(a){console.error("Complete Error Object:",a)}}}),[N,f]=o.useState([]),[M,_]=o.useState(["Developer","Tester","DB","Devops","BA"]),[u,m]=o.useState(!0),[y,E]=o.useState(null),[g,x]=o.useState(1),[C,R]=o.useState(!0),[S,T]=o.useState("");o.useEffect(()=>{(async()=>{m(!0),E(null);try{const a=await ce(g,S);f(p=>[...p,...a.data]),R(a.data.length>0)}catch(a){E(a.message)}finally{m(!1)}})()},[g,S]);const D=r=>{r.currentTarget.scrollHeight===r.currentTarget.scrollTop+r.currentTarget.clientHeight&&C&&!u&&x(p=>p+1)};return e(v,{component:"form",onSubmit:t.handleSubmit,sx:{display:"flex",flexDirection:"column",gap:2,width:"30em"},children:s(i,{container:!0,xs:12,spacing:2,children:[e(i,{item:!0,xs:12,sm:6,children:e(U,{options:N,getOptionLabel:r=>r.Employee_name,onChange:(r,a)=>{t.setFieldValue("Emp_Id",a?a.Emp_Id:null)},onBlur:t.handleBlur,onInputChange:(r,a)=>{T(a),f([]),x(1)},renderInput:r=>e(P,{...r,label:"Select Employee",variant:"outlined",error:t.touched.Emp_Id&&!!t.errors.Emp_Id,helperText:t.touched.Emp_Id&&t.errors.Emp_Id}),loading:u,noOptionsText:u?"Loading...":"No options",ListboxProps:{onScroll:D}})}),e(i,{item:!0,xs:12,sm:6,children:s(F,{fullWidth:!0,size:"small",children:[s(P,{select:!0,label:"Role",id:"Role_Id",name:"Role_Id",value:t.values.Role_Id||"",onChange:t.handleChange,onBlur:t.handleBlur,error:t.touched.Role_Id&&!!t.errors.Role_Id,children:[e(w,{value:2,children:"Team Lead"}),e(w,{value:3,children:"Member"})]}),e(L,{error:t.touched.Role_Id&&!!t.errors.Role_Id,children:t.touched.Role_Id&&t.errors.Role_Id})]})}),e(i,{item:!0,xs:12,children:s(F,{fullWidth:!0,size:"small",children:[e(P,{select:!0,label:"Designation",id:"Degesination",name:"Degesination",value:t.values.Degesination||"",onChange:t.handleChange,onBlur:t.handleBlur,error:t.touched.Degesination&&!!t.errors.Degesination,children:M.map((r,a)=>e(w,{value:r,children:r},a))}),t.touched.Degesination&&t.errors.Degesination&&e(L,{error:!0,children:t.errors.Degesination})]})}),e(i,{item:!0,xs:12,children:e(k,{color:"primary",variant:"contained",type:"submit",children:"Register"})})]})})},me=({open:c,onClose:d,fetchEmployees:b})=>s(X,{open:c,onClose:d,children:[s(i,{xs:12,container:!0,spacing:2,paddingTop:2,justifyContent:"space-between",sx:{display:"flex"},children:[e(i,{children:e(V,{sx:{paddingLeft:"40px",color:"primary.main",fontWeight:"bold",fontSize:"1.5em"},children:"Add New Member"})}),e(i,{children:e(G,{children:e(B,{title:"Close",sx:{color:"red"},children:e(A,{children:e(J,{onClick:()=>d(!1),sx:{fontSize:"1.4em"}})})})})})]}),e(K,{children:e(ue,{fetchEmployees:b,onClose:d})})]}),l=H(Z)(({theme:c})=>({[`&.${z.head}`]:{backgroundColor:"#f26729",color:"white",padding:"1em 8px"},[`&.${z.body}`]:{fontSize:12,padding:"6px 8px"}})),ge=H(O)(({theme:c})=>({"&:nth-of-type(odd)":{backgroundColor:c.palette.action.hover},"&:last-child td, &:last-child th":{border:0}})),ye=()=>{const{id:c}=q(),[d,b]=o.useState([]),[I,t]=o.useState(!1),[N,f]=o.useState(!0),[M,_]=o.useState(null),[u,m]=o.useState(0),[y,E]=o.useState(5),[g,x]=o.useState(""),[C,R]=o.useState(0),S=()=>{t(!0)},T=(n=!1)=>{t(!1)},D=async()=>{f(!0),_(null);try{const n=await he(Number(c),u+1,y,g);b(n.data),R(n.total)}catch(n){_(n.message)}finally{f(!1)}};o.useEffect(()=>{D()},[c,u,y,g]);const r=(n,h)=>{m(h)},a=n=>{E(parseInt(n.target.value,10)),m(0)};return e(de,{children:s(v,{sx:{width:"auto",overflow:"auto",paddingLeft:2,paddingRight:2},children:[e(i,{container:!0,spacing:2,children:e(i,{item:!0,xs:12,padding:2,sx:{marginTop:"1.4em"},children:s(v,{sx:{display:"flex",alignItems:"center",justifyContent:"space-between"},children:[e(i,{children:e(se,{value:g,onChange:n=>{x(n.target.value),m(0)},placeholder:"Search by Employee Name",size:"small"})}),e(i,{children:e(k,{variant:"contained",color:"primary",onClick:S,children:"Add New Member"})}),e(me,{open:I,onClose:n=>T(n),fetchEmployees:D})]})})}),e(Y,{component:ee,children:s(te,{sx:{minWidth:700},"aria-label":"customized table",children:[e(ne,{children:s(O,{children:[e(l,{children:"S.No"}),e(l,{align:"center",children:"Emp Id"}),e(l,{align:"center",children:"Project Name"}),e(l,{align:"center",children:"Employee Name"}),e(l,{align:"center",children:"Role"}),e(l,{align:"center",children:"Designation"}),e(l,{align:"center",children:"Actions"})]})}),e(ae,{children:d==null?void 0:d.map((n,h)=>s(ge,{children:[e(l,{component:"th",scope:"row",children:u*y+h+1}),e(l,{align:"center",children:n.Emp_Id}),e(l,{align:"center",children:n.Project_Name}),e(l,{align:"center",children:n.Employee_name}),e(l,{align:"center",children:n.Role_Name}),e(l,{align:"center",children:n.Degesination}),s(l,{align:"center",children:[e(B,{title:"Edit",placement:"top",children:e(A,{children:e(re,{color:"blue"})})}),e(B,{title:"Delete",placement:"top",children:e(A,{children:e(oe,{color:"red"})})})]})]},n.Emp_Id))})]})}),e(le,{component:"div",count:C,page:u,onPageChange:r,rowsPerPage:y,onRowsPerPageChange:a})]})})};export{ye as default};