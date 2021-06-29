import React from 'react'
import { Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { withToastManager } from 'react-toast-notifications';
import { withMenuBar } from '../Hocs/withMenuBar';
import { connect } from 'react-redux';
import mapToStateProps from '../mapStateProps/mapStateToProps'
import dispatchers from '../mapDispatch/mapDispathToProps';

import ReactDataGrid from 'react-data-grid';

const COLUMN_WIDTH = 140;

const columns = [
    { key: 'Etapa', name: 'Etapa',frozen : true, width : COLUMN_WIDTH },
    { key: 'Parametro', name: 'Title',frozen : true,width : COLUMN_WIDTH },
    { key: 'Min', name: 'Mínimo',frozen : true,width : COLUMN_WIDTH },
    { key: 'MinT', name: 'Min.Trabalho',frozen : true,width : COLUMN_WIDTH },
    { key: 'MaxT', name: 'Max.Trabalho',frozen : true,width : COLUMN_WIDTH },
    { key: 'Max', name: 'Máximo' ,frozen : true,width : COLUMN_WIDTH},
    { key: 'Frequencia', name: 'Freq.',frozen : true,width : COLUMN_WIDTH}    
];
  
const rows = [{id: 0, title: 'row1', count: 20}, {id: 1, title: 'row1', count: 40}, {id: 2, title: 'row1', count: 60},{id: 3, title: 'row1', count: 20},{id: 4, title: 'row1', count: 20},{id: 5, title: 'row1', count: 20},{id: 6, title: 'row1', count: 20},{id: 7, title: 'row1', count: 20}];
  

const RegistroDeAnalise = (props) => {
 
  

      return (<ReactDataGrid
      columns={  columns.concat({ key: 'data1', name: '21/06/21' },{ key: 'data2', name: '22/06/21' },{ key: 'data3', name: '23/06/21'},{ key: 'data4', name: '24/06/21'},{ key: 'data4', name: '25/06/21'},{ key: 'data6', name: '26/06/21'},{ key: 'data7', name: '27/06/21'} )}
      rows={rows}
      
      rowGetter={i => rows[i]}
      rowsCount={3}
      minHeight={150} />);


}



export default withToastManager(withMenuBar(connect(mapToStateProps.toProps, dispatchers)(RegistroDeAnalise)))