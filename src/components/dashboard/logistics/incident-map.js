import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import { Map, Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

import { config } from '@/config';
import { useSettings } from '@/hooks/use-settings';
import { fetchApiWithAuth } from '@/lib/auth/custom/client';

export function IncidentMap({ onIncidentSelect, currentIncidentId, incidents = [] }) {
  const {
    settings: { colorScheme = 'light' },
  } = useSettings();

  const mapRef = React.useRef(null);

  const [viewState, setViewState] = React.useState({
    latitude: 51.11457057720798,
    longitude: 71.41806471404513,
    zoom: 12,
  });

  const [selectedIncident, setSelectedIncident] = React.useState(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [openIncidentModal, setOpenIncidentModal] = React.useState(false);
  const [openEmployeeModal, setOpenEmployeeModal] = React.useState(false);
  const [employees, setEmployees] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const data = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/employee', { method: 'GET' });
        if (Array.isArray(data)) {
          setEmployees(data);
        }
      } catch (error) {
        setError(error.message);
      }
    };
    fetchEmployees();
  }, []);

  const handleIncidentClick = (incident) => {
    // Check if the incident already has an assigned employee
    const assignedEmployee = employees.find(emp => emp.id === incident.assigned_employee_id);
    setSelectedIncident(incident);
    setSelectedEmployee(assignedEmployee || null); // Set the assigned employee if it exists
    setOpenIncidentModal(true);
    setOpenEmployeeModal(false);
  };

  const handleEmployeeClick = (employee) => {
    setSelectedEmployee(employee);
    setOpenEmployeeModal(true);
    setOpenIncidentModal(false);
  };

  const handleCloseIncidentModal = () => {
    setSelectedIncident(null);
    setOpenIncidentModal(false);
  };

  const handleCloseEmployeeModal = () => {
    setSelectedEmployee(null);
    setOpenEmployeeModal(false);
  };

  const handleEmployeeChange = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    setSelectedEmployee(employee);
  };

  // Функция для сохранения инцидента и изменения статуса
  const handleSaveIncident = async () => {
    if (selectedIncident && selectedEmployee) {
      const updatedIncident = {
        ...selectedIncident,
        status: selectedEmployee ? 'Отправлено' : 'В ожиданий', // Меняем статус на основе наличия назначенного сотрудника
      };

      try {
        // Отправляем PATCH-запрос для привязки сотрудника к инциденту
        await fetchApiWithAuth(`http://37.99.82.96:8000/api/v1/incident-web/${selectedIncident.id}/update`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            set_employee: selectedEmployee.id, // Передаем ID сотрудника
          }),
        });

        // Обновляем инцидент на клиенте
        setSelectedIncident(updatedIncident);

        // Закрываем модальное окно
        handleCloseIncidentModal();
      } catch (error) {
        console.error('Error updating incident:', error);
        setError('Не удалось обновить инцидент');
      }
    }
  };

  const renderIncidentMedia = (incident) => {
    const mediaContent = incident.media?.[0]?.content || ''; // Base64 content for image or video
    const mediaType = incident.media?.[0]?.type || ''; // Type could be "image" or "video"
    const mediaUrl = incident.media_url?.[0] || ''; // URL address for image or video

    // If base64 content is available, check for type and render accordingly
    if (mediaContent) {
      if (mediaType === 'video') {
        return (
          <video
            controls
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          >
            <source src={`data:video/mp4;base64,${mediaContent}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }

      return (
        <img
          src={`data:image/jpeg;base64,${mediaContent}`}
          alt={incident.title || 'Media not found'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
        />
      );
    }

    // If there's a media URL, check for type and render accordingly
    if (mediaUrl) {
      if (mediaType === 'video') {
        return (
          <video
            controls
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
          >
            <source src={`http://37.99.82.96:8000${mediaUrl}`} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        );
      }

      return (
        <img
          src={`http://37.99.82.96:8000${mediaUrl}`}
          onError={(e) => {
            e.target.src = 'http://37.99.82.96:8000/backup_image.jpg'; // Fallback image path
            console.log('Image load error', mediaUrl);
          }}
          alt={incident.title || 'Image not found'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
        />
      );
    }

    // If nothing is available, show "No media available"
    return <Typography variant="body2">No media available</Typography>;
  };

  return (
    <>
      <Map
        initialViewState={viewState}
        mapStyle={colorScheme === 'dark' ? 'mapbox://styles/mapbox/dark-v9' : 'mapbox://styles/mapbox/light-v9'}
        mapboxAccessToken={config.mapbox.apiKey}
        ref={mapRef}
        style={{ width: '100%', height: '500px' }}
      >
        {Array.isArray(incidents) &&
          incidents.map((incident) => {
            const latitude = incident.geo?.coordinates?.[1];
            const longitude = incident.geo?.coordinates?.[0];

            if (typeof latitude === 'number' && typeof longitude === 'number') {
              return (
                <Marker
                  key={incident.id}
                  latitude={latitude}
                  longitude={longitude}
                  onClick={() => handleIncidentClick(incident)}
                >
                  <Box sx={{ width: '30px', height: '30px', backgroundColor: 'red', borderRadius: '50%' }} />
                </Marker>
              );
            }
            return null;
          })}

        {Array.isArray(employees) &&
          employees.map((employee) => {
            const longitude = employee.location?.coordinates?.[0];
            const latitude = employee.location?.coordinates?.[1];

            if (typeof latitude === 'number' && typeof longitude === 'number') {
              return (
                <Marker
                  key={employee.id}
                  longitude={longitude}
                  latitude={latitude}
                  onClick={() => handleEmployeeClick(employee)}
                >
                  <Box sx={{ width: '20px', height: '20px', backgroundColor: 'blue', borderRadius: '50%' }} />
                </Marker>
              );
            }
            return null;
          })}
      </Map>

      {/* Модальное окно для инцидентов */}
      {selectedIncident && (
        <>
          <Dialog open={openIncidentModal} onClose={handleCloseIncidentModal} fullWidth maxWidth="sm">
            <DialogTitle>Информация о происшествии</DialogTitle>
            <DialogContent>
              <Box
                sx={{
                  width: '100%',
                  height: '200px',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: '16px',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                }}
              >
                {renderIncidentMedia(selectedIncident)}
              </Box>

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginTop: '16px',
                  fontSize: '0.9rem',
                  color: '#555',
                }}
              >
                
              </Box>

              <Typography variant="body1" sx={{ marginTop: '16px', fontWeight: 500 }}>
                {selectedIncident.title || 'Заголовок недоступен'}
              </Typography>

              <Typography variant="body2" sx={{ marginTop: '8px', fontWeight: 400 }}>
                {selectedIncident.tags || 'Теги недоступны'}
              </Typography>
              <Typography variant="body2" sx={{ marginTop: '8px', color: 'grey' }}>
                Статус: {selectedIncident.status}
              </Typography>

              {/* Display assigned employee */}
              {selectedEmployee && (
                <Typography variant="body2" sx={{ marginTop: '8px', fontWeight: 500, color: 'green' }}>
                  Назначенный сотрудник: {selectedEmployee.name}
                </Typography>
              )}

              <TextField
                label="Назначенный сотрудник"
                select
                value={selectedEmployee?.id || ''}
                onChange={(e) => handleEmployeeChange(e.target.value)}
                fullWidth
                margin="normal"
                variant="outlined"
              >
                {employees.map((employee) => (
                  <MenuItem key={employee.id} value={employee.id}>
                    {employee.name}
                  </MenuItem>
                ))}
              </TextField>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleSaveIncident} variant="contained" color="primary" sx={{ width: '100%' }}>
                Сохранить
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

      {/* Модальное окно для сотрудников */}
      {selectedEmployee && (
        <Dialog open={openEmployeeModal} onClose={handleCloseEmployeeModal} fullWidth maxWidth="sm">
          <DialogTitle>Информация о сотруднике</DialogTitle>
          <DialogContent>
            <Typography variant="body1" sx={{ marginTop: '16px', fontWeight: 500 }}>
              {selectedEmployee.name}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: '8px', color: 'grey' }}>
              Роль: {selectedEmployee.role}
            </Typography>
            <Typography variant="body2" sx={{ marginTop: '8px', color: 'grey' }}>
              Контакт: {selectedEmployee.contact || 'Не указано'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEmployeeModal} variant="contained" color="primary" sx={{ width: '100%' }}>
              Закрыть
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}



// import * as React from 'react';
// import Box from '@mui/material/Box';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import Dialog from '@mui/material/Dialog';
// import DialogActions from '@mui/material/DialogActions';
// import DialogContent from '@mui/material/DialogContent';
// import DialogTitle from '@mui/material/DialogTitle';
// import TextField from '@mui/material/TextField';
// import MenuItem from '@mui/material/MenuItem';
// import { Map, Marker } from 'react-map-gl';
// import 'mapbox-gl/dist/mapbox-gl.css';

// import { config } from '@/config';
// import { useSettings } from '@/hooks/use-settings';
// import { fetchApiWithAuth } from '@/lib/auth/custom/client';
// import TokenService from '@/lib/auth/custom/refresh';

// export function IncidentMap({ onIncidentSelect, currentIncidentId, incidents = [] }) {
//   const {
//     settings: { colorScheme = 'light' },
//   } = useSettings();

//   const mapRef = React.useRef(null);
//   const [viewState, setViewState] = React.useState({
//     latitude: 51.11457057720798,
//     longitude: 71.41806471404513,
//     zoom: 12,
//   });

//   const [selectedIncident, setSelectedIncident] = React.useState(null);
//   const [selectedEmployee, setSelectedEmployee] = React.useState(null);
//   const [openIncidentModal, setOpenIncidentModal] = React.useState(false);
//   const [openEmployeeModal, setOpenEmployeeModal] = React.useState(false);
//   const [employees, setEmployees] = React.useState([]);
//   const [error, setError] = React.useState(null);

//   // Обновление токена каждые 14 минут (840000 миллисекунд)
//   React.useEffect(() => {
//     const interval = setInterval(async () => {
//       try {
//         await TokenService.refreshTokens();
//       } catch (error) {
//         console.error('Ошибка при обновлении токена:', error);
//       }
//     }, 840000); // 14 минут

//     return () => clearInterval(interval); // Очищаем интервал при размонтировании компонента
//   }, []);

//   React.useEffect(() => {
//     const fetchEmployees = async () => {
//       try {
//         const data = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/employee', { method: 'GET' });
//         if (Array.isArray(data)) {
//           setEmployees(data);
//         }
//       } catch (error) {
//         setError(error.message);
//       }
//     };
//     fetchEmployees();
//   }, []);

//   const handleIncidentClick = (incident) => {
//     setSelectedIncident(incident);
//     setOpenIncidentModal(true);
//     setOpenEmployeeModal(false);
//   };

//   const handleEmployeeClick = (employee) => {
//     setSelectedEmployee(employee);
//     setOpenEmployeeModal(true);
//     setOpenIncidentModal(false);
//   };

//   const handleCloseIncidentModal = () => {
//     setSelectedIncident(null);
//     setOpenIncidentModal(false);
//   };

//   const handleCloseEmployeeModal = () => {
//     setSelectedEmployee(null);
//     setOpenEmployeeModal(false);
//   };

//   const handleEmployeeChange = (employeeId) => {
//     setSelectedEmployee(employees.find((emp) => emp.id === employeeId));
//   };

//   const handleSaveIncident = () => {
//     if (selectedIncident) {
//       setSelectedIncident((prevIncident) => ({
//         ...prevIncident,
//         status: selectedEmployee ? 'Отправлено' : 'В ожиданий',
//       }));
//       handleCloseIncidentModal();
//     }
//   };

//   const renderIncidentMedia = (incident) => {
//     const mediaContent = incident.media?.[0]?.content || '';
//     const mediaType = incident.media?.[0]?.type || '';
//     const mediaUrl = incident.media_url?.[0] || '';

//     if (mediaContent) {
//       if (mediaType === 'video') {
//         return (
//           <video
//             controls
//             style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
//           >
//             <source src={`data:video/mp4;base64,${mediaContent}`} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         );
//       }

//       return (
//         <img
//           src={`data:image/jpeg;base64,${mediaContent}`}
//           alt={incident.title || 'Media not found'}
//           style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
//         />
//       );
//     }

//     if (mediaUrl) {
//       if (mediaType === 'video') {
//         return (
//           <video
//             controls
//             style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
//           >
//             <source src={`http://37.99.82.96:8000${mediaUrl}`} type="video/mp4" />
//             Your browser does not support the video tag.
//           </video>
//         );
//       }

//       return (
//         <img
//           src={`http://37.99.82.96:8000${mediaUrl}`}
//           onError={(e) => {
//             e.target.src = 'http://37.99.82.96:8000/backup_image.jpg';
//           }}
//           alt={incident.title || 'Image not found'}
//           style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
//         />
//       );
//     }

//     return <Typography variant="body2">No media available</Typography>;
//   };

//   return (
//     <>
//       <Map
//         initialViewState={viewState}
//         mapStyle={colorScheme === 'dark' ? 'mapbox://styles/mapbox/dark-v9' : 'mapbox://styles/mapbox/light-v9'}
//         mapboxAccessToken={config.mapbox.apiKey}
//         ref={mapRef}
//         style={{ width: '100%', height: '500px' }}
//       >
//         {Array.isArray(incidents) &&
//           incidents.map((incident) => {
//             const latitude = incident.geo?.coordinates?.[1];
//             const longitude = incident.geo?.coordinates?.[0];

//             if (typeof latitude === 'number' && typeof longitude === 'number') {
//               return (
//                 <Marker
//                   key={incident.id}
//                   latitude={latitude}
//                   longitude={longitude}
//                   onClick={() => handleIncidentClick(incident)}
//                 >
//                   <Box sx={{ width: '30px', height: '30px', backgroundColor: 'red', borderRadius: '50%' }} />
//                 </Marker>
//               );
//             }
//             return null;
//           })}

//         {Array.isArray(employees) &&
//           employees.map((employee) => {
//             const longitude = employee.location?.coordinates?.[0];
//             const latitude = employee.location?.coordinates?.[1];

//             if (typeof latitude === 'number' && typeof longitude === 'number') {
//               return (
//                 <Marker
//                   key={employee.id}
//                   longitude={longitude}
//                   latitude={latitude}
//                   onClick={() => handleEmployeeClick(employee)}
//                 >
//                   <Box sx={{ width: '20px', height: '20px', backgroundColor: 'blue', borderRadius: '50%' }} />
//                 </Marker>
//               );
//             }
//             return null;
//           })}
//       </Map>

//       {selectedIncident && (
//         <Dialog open={openIncidentModal} onClose={handleCloseIncidentModal} fullWidth maxWidth="sm">
//           <DialogTitle>Информация о происшествии</DialogTitle>
//           <DialogContent>
//             <Box
//               sx={{
//                 width: '100%',
//                 height: '200px',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 alignItems: 'center',
//                 marginBottom: '16px',
//                 borderRadius: '8px',
//                 overflow: 'hidden',
//                 boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
//               }}
//             >
//               {renderIncidentMedia(selectedIncident)}
//             </Box>

//             <Box
//               sx={{
//                 display: 'flex',
//                 justifyContent: 'space-between',
//                 marginTop: '16px',
//                 fontSize: '0.9rem',
//                 color: '#555',
//               }}
//             >
//               <Typography>{new Date(selectedIncident.createdDate).toLocaleDateString()}</Typography>
//               <Typography>{new Date(selectedIncident.createdDate).toLocaleTimeString()}</Typography>
//             </Box>

//             <Typography variant="body1" sx={{ marginTop: '16px', fontWeight: 500 }}>
//               {selectedIncident.title || 'Заголовок недоступен'}
//             </Typography>

//             <Typography variant="body2" sx={{ marginTop: '8px', fontWeight: 400 }}>
//               {selectedIncident.tags || 'Теги недоступны'}
//             </Typography>
//             <Typography variant="body2" sx={{ marginTop: '8px', color: 'grey' }}>
//               Статус: {selectedIncident.status}
//             </Typography>

//             <TextField
//               label="Achievement"
//               value={selectedIncident.achievement_sum || '0'}
//               fullWidth
//               margin="normal"
//               InputProps={{
//                 readOnly: true,
//               }}
//               variant="outlined"
//               sx={{ marginTop: '16px' }}
//             />

//             <TextField
//               label="Назначенный сотрудник"
//               select
//               value={selectedEmployee?.id || ''}
//               onChange={(e) => handleEmployeeChange(e.target.value)}
//               fullWidth
//               margin="normal"
//               variant="outlined"
//             >
//               {employees.map((employee) => (
//                 <MenuItem key={employee.id} value={employee.id}>
//                   {employee.name}
//                 </MenuItem>
//               ))}
//             </TextField>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseIncidentModal} variant="contained" color="primary" sx={{ width: '100%' }}>
//               Сохранить
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}

//       {selectedEmployee && (
//         <Dialog open={openEmployeeModal} onClose={handleCloseEmployeeModal} fullWidth maxWidth="sm">
//           <DialogTitle>Информация о сотруднике</DialogTitle>
//           <DialogContent>
//             <Typography variant="body1" sx={{ marginTop: '16px', fontWeight: 500 }}>
//               {selectedEmployee.name}
//             </Typography>
//             <Typography variant="body2" sx={{ marginTop: '8px', color: 'grey' }}>
//               Роль: {selectedEmployee.role}
//             </Typography>
//             <Typography variant="body2" sx={{ marginTop: '8px', color: 'grey' }}>
//               Контакт: {selectedEmployee.contact || 'Не указано'}
//             </Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseEmployeeModal} variant="contained" color="primary" sx={{ width: '100%' }}>
//               Закрыть
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}
//     </>
//   );
// }
