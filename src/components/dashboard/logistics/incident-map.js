
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

// export function IncidentMap({ onIncidentSelect, currentIncidentId, incidents = [], setIncidents }) {
//   const {
//     settings: { colorScheme = 'light' },
//   } = useSettings();

//   const mapRef = React.useRef(null);

//   const [viewState, setViewState] = React.useState({
//     latitude: 51.11457057720798,
//     longitude: 71.41806471404513,
//     zoom: 12,
//   });

//   const [categories, setCategories] = React.useState([]);
//   const [selectedIncident, setSelectedIncident] = React.useState(null);
//   const [selectedEmployee, setSelectedEmployee] = React.useState(null);
//   const [openIncidentModal, setOpenIncidentModal] = React.useState(false);
//   const [openEmployeeModal, setOpenEmployeeModal] = React.useState(false);
//   const [openConfirmationModal, setOpenConfirmationModal] = React.useState(false);
//   const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = React.useState(false);
//   const [employees, setEmployees] = React.useState([]);
//   const [error, setError] = React.useState(null);

//   // Fetch categories (tags) from the API
//   React.useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/tags/', { method: 'GET' });
//         if (Array.isArray(response)) {
//           setCategories(response);
//         }
//       } catch (error) {
//         console.error('Error fetching categories:', error);
//         setError('Не удалось загрузить категории инцидентов');
//       }
//     };
//     fetchCategories();
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

//   // Define custom image URLs for different categories (tags)
//   const incidentImageMapping = {
//     'Вандализм несовершеннолетних': '/assets/вандализм.png',
//     'Травля несовершеннолетнего': '/assets/травля.png',
//     'Распитие алкогольных напитков в общественном месте': '/assets/распитие.png',
//     'Умышленное причинение легкого вреда здоровью': '/assets/умышленное.png',
//     'Побои': '/assets/поббои.png',
//     'Превышение скорости движения 10-20 км/ч': '/assets/10-20.png',
//     'Превышение скорости движения 20-40 км/ч': '/assets/20-40.png',
//     'Нарушение правил остановки или стоянки ТС': '/assets/нарушение.png',
//     'Проезд на красный/запрещающий жест': '/assets/накрасный.png',
//     'Несоблюдение Знаков/Разметки': '/assets/несаблюдение.png',
//     // Add more categories and corresponding images if necessary
//   };

//   // Helper function to get image based on category
//   const getIncidentImage = (incidentTag) => {
//     return incidentImageMapping[incidentTag] || '/images/default.png'; // Default to 'default.png' if tag is not found
//   };

//   const handleIncidentClick = (incident) => {
//     const assignedEmployee = employees.find(emp => emp.id === incident.assigned_employee_id);
//     setSelectedIncident(incident);
//     setSelectedEmployee(assignedEmployee || null);
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

//   const handleCloseConfirmationModal = () => {
//     setOpenConfirmationModal(false);
//     window.location.reload();
//   };

//   const handleEmployeeChange = (employeeId) => {
//     const employee = employees.find((emp) => emp.id === employeeId);
//     setSelectedEmployee(employee);
//   };

//   const handleSaveIncident = async () => {
//     if (selectedIncident && selectedEmployee) {
//       try {
//         await fetchApiWithAuth(
//           `http://37.99.82.96:8000/api/v1/incident-web/${selectedIncident.id}/update`,
//           {
//             method: 'PATCH',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ set_employee: selectedEmployee.id }),
//           }
//         );
//         setOpenConfirmationModal(true);
//       } catch (error) {
//         console.error('Error updating incident:', error);
//         setError('Не удалось обновить инцидент');
//       }
//     }
//   };

//   const handleDeleteIncident = async () => {
//     if (selectedIncident) {
//       try {
//         const response = await fetchApiWithAuth(`http://37.99.82.96:8000/api/v1/incident-web/${selectedIncident.id}`, {
//           method: 'DELETE',
//           headers: { 'Content-Type': 'application/json' },
//         });
//         if (response === null || response.status === 204) {
//           setOpenDeleteConfirmationModal(true);
//         } else {
//           console.error('Ошибка удаления инцидента:', response.statusText || 'Неизвестная ошибка');
//           setError('Не удалось удалить инцидент');
//         }
//       } catch (error) {
//         console.error('Ошибка удаления инцидента:', error);
//         setError('Не удалось удалить инцидент');
//       }
//     }
//   };

//   const handleCloseDeleteConfirmationModal = () => {
//     setOpenDeleteConfirmationModal(false);
//     window.location.reload();
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
//             console.log('Image load error', mediaUrl);
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
//             const incidentTags = incident.tags;

//             if (typeof latitude === 'number' && typeof longitude === 'number') {
//               const incidentImage = getIncidentImage(incidentTags); // Get image based on category
//               return (
//                 <Marker
//                   key={incident.id}
//                   latitude={latitude}
//                   longitude={longitude}
//                   onClick={() => handleIncidentClick(incident)}
//                 >
//                   <img
//                     src={incidentImage}
//                     alt={incidentTags}
//                     style={{ width: '30px', height: '30px', borderRadius: '50%' }}
//                   />
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
//         <>
//           <Dialog open={openIncidentModal} onClose={handleCloseIncidentModal} fullWidth maxWidth="sm">
//             <DialogTitle>Информация о происшествии</DialogTitle>
//             <DialogContent>
//               <Box
//                 sx={{
//                   width: '100%',
//                   height: '200px',
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   marginBottom: '16px',
//                   borderRadius: '8px',
//                   overflow: 'hidden',
//                   boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
//                 }}
//               >
//                 {renderIncidentMedia(selectedIncident)}
//               </Box>

//               <Typography variant="body1" sx={{ marginTop: '16px', fontWeight: 500 }}>
//                 Название: {selectedIncident.title || 'Заголовок недоступен'}
//               </Typography>

//               <Typography variant="body2" sx={{ marginTop: '8px', fontWeight: 400 }}>
//                 Категория: {selectedIncident.tags || 'Теги недоступны'}
//               </Typography>

//               {selectedEmployee && (
//                 <Typography variant="body2" sx={{ marginTop: '8px', fontWeight: 500, color: 'green' }}>
//                   Назначенный сотрудник: {`${selectedEmployee.name} ${selectedEmployee.surname} (${selectedEmployee.role})`}
//                 </Typography>
//               )}

//               <TextField
//                 label="Назначенный сотрудник"
//                 select
//                 value={selectedEmployee?.id || ''}
//                 onChange={(e) => handleEmployeeChange(e.target.value)}
//                 fullWidth
//                 margin="normal"
//                 variant="outlined"
//               >
//                 {employees.map((employee) => (
//                   <MenuItem key={employee.id} value={employee.id}>
//                     {employee.name}
//                   </MenuItem>
//                 ))}
//               </TextField>
//             </DialogContent>
//             <DialogActions>
//               <Button onClick={handleSaveIncident} variant="contained" color="primary" sx={{ width: '100%' }}>
//                 Сохранить
//               </Button>
//               <Button onClick={handleDeleteIncident} variant="contained" color="error" sx={{ width: '100%' }}>
//                 Удалить инцидент
//               </Button>
//             </DialogActions>
//           </Dialog>
//         </>
//       )}

//       {openConfirmationModal && (
//         <Dialog open={openConfirmationModal} onClose={handleCloseConfirmationModal} fullWidth maxWidth="sm">
//           <DialogTitle>Подтверждение</DialogTitle>
//           <DialogContent>
//             <Typography>Инцидент успешно обновлен.</Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseConfirmationModal} variant="contained" color="primary" sx={{ width: '100%' }}>
//               OK
//             </Button>
//           </DialogActions>
//         </Dialog>
//       )}

//       {openDeleteConfirmationModal && (
//         <Dialog open={openDeleteConfirmationModal} onClose={handleCloseDeleteConfirmationModal} fullWidth maxWidth="sm">
//           <DialogTitle>Подтверждение удаления</DialogTitle>
//           <DialogContent>
//             <Typography>Инцидент успешно удален.</Typography>
//           </DialogContent>
//           <DialogActions>
//             <Button onClick={handleCloseDeleteConfirmationModal} variant="contained" color="primary" sx={{ width: '100%' }}>
//               OK
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

export function IncidentMap({ onIncidentSelect, currentIncidentId, incidents = [], setIncidents }) {
  const {
    settings: { colorScheme = 'light' },
  } = useSettings();

  const mapRef = React.useRef(null);
  const [mapKey, setMapKey] = React.useState(0); // Ключ для перерисовки карты

  const [viewState, setViewState] = React.useState({
    latitude: 51.11457057720798,
    longitude: 71.41806471404513,
    zoom: 12,
  });

  const [categories, setCategories] = React.useState([]);
  const [selectedIncident, setSelectedIncident] = React.useState(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [openIncidentModal, setOpenIncidentModal] = React.useState(false);
  const [openEmployeeModal, setOpenEmployeeModal] = React.useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = React.useState(false);
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = React.useState(false);
  const [employees, setEmployees] = React.useState([]);
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/tags/', { method: 'GET' });
        if (Array.isArray(response)) {
          setCategories(response);
        }
      } catch (error) {
        setError('Не удалось загрузить категории инцидентов');
      }
    };
    fetchCategories();
  }, []);

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

  // Функция для получения изображения по категории инцидента
  const getIncidentImage = (incidentTag) => {
    const incidentImageMapping = {
      'Вандализм несовершеннолетних': '/assets/вандализм.png',
      'Травля несовершеннолетнего': '/assets/травля.png',
      'Распитие алкогольных напитков в общественном месте': '/assets/распитие.png',
      'Умышленное причинение легкого вреда здоровью': '/assets/умышленное.png',
      'Побои': '/assets/поббои.png',
      'Превышение скорости движения 10-20 км/ч': '/assets/10-20.png',
      'Превышение скорости движения 20-40 км/ч': '/assets/20-40.png',
      'Нарушение правил остановки или стоянки ТС': '/assets/нарушение.png',
      'Проезд на красный/запрещающий жест': '/assets/накрасный.png',
      'Несоблюдение Знаков/Разметки': '/assets/несаблюдение.png',
    };
    return incidentImageMapping[incidentTag] || '/images/default.png';
  };

  // Функция для рендеринга медиа
  const renderIncidentMedia = (incident) => {
    const mediaContent = incident.media?.[0]?.content || '';
    const mediaType = incident.media?.[0]?.type || '';
    const mediaUrl = incident.media_url?.[0] || '';

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
            e.target.src = 'http://37.99.82.96:8000/backup_image.jpg';
            console.log('Image load error', mediaUrl);
          }}
          alt={incident.title || 'Image not found'}
          style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
        />
      );
    }

    return <Typography variant="body2">No media available</Typography>;
  };

  const handleIncidentClick = (incident) => {
    const assignedEmployee = employees.find(emp => emp.id === incident.assigned_employee_id);
    setSelectedIncident(incident);
    setSelectedEmployee(assignedEmployee || null);
    setOpenIncidentModal(true);
    setOpenEmployeeModal(false);
  };

  const handleSaveIncident = async () => {
    if (selectedIncident && selectedEmployee) {
      try {
        await fetchApiWithAuth(
          `http://37.99.82.96:8000/api/v1/incident-web/${selectedIncident.id}/update`,
          {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ set_employee: selectedEmployee.id }),
          }
        );
        setOpenIncidentModal(false); // Закрываем окно
        const updatedIncidents = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/incident-web/', { method: 'GET' });
        if (typeof setIncidents === 'function') {
          setIncidents(updatedIncidents);
        } else {
          console.error('setIncidents is not a function');
        }
      } catch (error) {
        console.error('Error updating incident:', error);
        setError('Не удалось обновить инцидент');
      }
    }
  };

  const handleDeleteIncident = async () => {
    if (selectedIncident) {
      try {
        const response = await fetchApiWithAuth(`http://37.99.82.96:8000/api/v1/incident-web/${selectedIncident.id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response === null) {        
          setOpenDeleteConfirmationModal(true);
          const updatedIncidents = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/incident-web/', { method: 'GET' });
          setIncidents(updatedIncidents); 
        } else if (response.ok) {
          setOpenDeleteConfirmationModal(true);
          const updatedIncidents = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/incident-web/', { method: 'GET' });
          setIncidents(updatedIncidents); 
        } else {
          throw new Error('Ошибка удаления инцидента: ' + (response.statusText || 'Неизвестная ошибка'));
        }
      } catch (error) {
        console.error('Ошибка удаления инцидента:', error);
        setError('Не удалось удалить инцидент');
      }
    }
  };

  const handleCloseConfirmationModal = () => {
    setOpenConfirmationModal(false);
  };

  const handleCloseDeleteConfirmationModal = () => {
    setOpenDeleteConfirmationModal(false);
    setOpenIncidentModal(false); // Закрываем модальное окно инцидента после подтверждения удаления
  };

  return (
    <>
      <Map
        key={mapKey}
        initialViewState={viewState}
        mapStyle={colorScheme === 'dark' ? 'mapbox://styles/mapbox/dark-v9' : 'mapbox://styles/mapbox/light-v9'}
        mapboxAccessToken={config.mapbox.apiKey}
        ref={mapRef}
        style={{ width: '100%', height: '500px' }}
      >
        {incidents.map((incident) => {
          const latitude = incident.geo?.coordinates?.[1];
          const longitude = incident.geo?.coordinates?.[0];
          const incidentTags = incident.tags;
          if (latitude && longitude) {
            return (
              <Marker
                key={incident.id}
                latitude={latitude}
                longitude={longitude}
                onClick={() => handleIncidentClick(incident)}
              >
                <img src={getIncidentImage(incidentTags)} alt={incidentTags} style={{ width: '30px', height: '30px' }} />
              </Marker>
            );
          }
          return null;
        })}

        {employees.map((employee) => {
          const latitude = employee.location?.coordinates?.[1];
          const longitude = employee.location?.coordinates?.[0];
          if (latitude && longitude) {
            return (
              <Marker
                key={employee.id}
                latitude={latitude}
                longitude={longitude}
                onClick={() => setSelectedEmployee(employee)}
              >
                <Box sx={{ width: '20px', height: '20px', backgroundColor: 'blue', borderRadius: '50%' }} />
              </Marker>
            );
          }
          return null;
        })}
      </Map>

      {selectedIncident && (
        <Dialog open={openIncidentModal} onClose={() => setOpenIncidentModal(false)} fullWidth maxWidth="sm">
          <DialogTitle>Информация о происшествии</DialogTitle>
          <DialogContent>
            <Typography variant="body1">{selectedIncident.title}</Typography>
            <Typography variant="body2">{selectedIncident.tags}</Typography>
            {renderIncidentMedia(selectedIncident)} {/* Вызов функции рендеринга медиа */}
            <TextField
              label="Назначенный сотрудник"
              select
              value={selectedEmployee?.id || ''}
              onChange={(e) => setSelectedEmployee(employees.find(emp => emp.id === e.target.value))}
              fullWidth
            >
              {employees.map((employee) => (
                <MenuItem key={employee.id} value={employee.id}>
                  {employee.name}
                </MenuItem>
              ))}
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSaveIncident} variant="contained" color="primary">Сохранить</Button>
            <Button onClick={handleDeleteIncident} variant="contained" color="error">Удалить</Button>
          </DialogActions>
        </Dialog>
      )}

      <Dialog open={openConfirmationModal} onClose={handleCloseConfirmationModal}>
        <DialogTitle>Подтверждение</DialogTitle>
        <DialogContent>Инцидент успешно обновлен.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirmationModal}>OK</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openDeleteConfirmationModal} onClose={handleCloseDeleteConfirmationModal}>
        <DialogTitle>Удаление</DialogTitle>
        <DialogContent>Инцидент успешно удален.</DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirmationModal}>OK</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
