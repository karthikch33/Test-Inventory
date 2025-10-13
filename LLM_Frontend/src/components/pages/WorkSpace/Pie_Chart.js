import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';

export default function BasicPie({passedRows,failedRows,totalRows}) {
  const passPercentage = totalRows ? (passedRows / totalRows) * 100 : 0;
  const failPercentage = totalRows ? (failedRows / totalRows) * 100 : 0;
  // alert(passPercentage + failPercentage)
  return (
    <PieChart
    title='Analysis'
      series={[
        { 
          data: [
            { id: 0, value: passPercentage, label: 'PASS',color:'lightgreen'},
            { id: 1, value: failPercentage, label: 'FAIL',color:'red'},
          ],
          innerRadius : 30,
        },
      ]}
      slotProps={{
        legend: false
      }}
      width={350}
      height={220}
    />
  );
}
