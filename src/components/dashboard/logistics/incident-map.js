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

export function IncidentMap({ onIncidentSelect, currentIncidentId, incidents = [], setIncidents }) {  // Pass in a setter for incidents
  const {
    settings: { colorScheme = 'light' },
  } = useSettings();

  const mapRef = React.useRef(null);

  const [viewState, setViewState] = React.useState({
    latitude: 51.11457057720798,
    longitude: 71.41806471404513,
    zoom: 12,
  });
  const getIncidentColor = (tags) => {
    if (!tags) return 'gray'; // Default color if no tags are provided

    // Example: color based on different tags
    switch (tags) {
      case 'Вандализм несовершеннолетних':
        return 'red';
      case 'Травля несовершеннолетнего':
        return 'orange';
      case 'Распитие алкогольных напитков в общественном месте':
        return 'blue';
      case 'Умышленное причинение легкого вреда здоровью':
        return 'green';
      default:
        return 'gray'; // Default color if tag doesn't match any specific case
    }
  };
  const [selectedIncident, setSelectedIncident] = React.useState(null);
  const [selectedEmployee, setSelectedEmployee] = React.useState(null);
  const [openIncidentModal, setOpenIncidentModal] = React.useState(false);
  const [openEmployeeModal, setOpenEmployeeModal] = React.useState(false);
  const [openConfirmationModal, setOpenConfirmationModal] = React.useState(false);
  const [openDeleteConfirmationModal, setOpenDeleteConfirmationModal] = React.useState(false); // For delete confirmation
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
    const assignedEmployee = employees.find(emp => emp.id === incident.assigned_employee_id);
    setSelectedIncident(incident);
    setSelectedEmployee(assignedEmployee || null);
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

  const handleCloseConfirmationModal = () => {
    setOpenConfirmationModal(false);
    window.location.reload(); // Перезагружаем страницу после подтверждения сохранения
  };

  const handleEmployeeChange = (employeeId) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    setSelectedEmployee(employee);
  };

  /*
  const handleSaveIncident = async () => {
    if (selectedIncident && selectedEmployee) {
      try {
        // Отправляем запрос на обновление
        await fetchApiWithAuth(
          `http://37.99.82.96:8000/api/v1/incident-web/${selectedIncident.id}/update`,
          {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              set_employee: selectedEmployee.id, // Отправляем только ID сотрудника
            }),
          }
        );
  
        // Открываем модальное окно подтверждения сразу после успешного запроса
        setOpenConfirmationModal(true);
      } catch (error) {
        console.error('Error updating incident:', error);
        setError('Не удалось обновить инцидент');
      }
    }
  };
  */

  const handleDeleteIncident = async () => {
    if (selectedIncident) {
      try {
        const response = await fetchApiWithAuth(`http://37.99.82.96:8000/api/v1/incident-web/${selectedIncident.id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });
  
        // Проверка успешного выполнения (204 No Content не имеет тела)
        if (response === null || response.status === 204) {
          setOpenDeleteConfirmationModal(true); // Открываем подтверждение
        } else {
          console.error('Ошибка удаления инцидента:', response.statusText || 'Неизвестная ошибка');
          setError('Не удалось удалить инцидент');
        }
      } catch (error) {
        console.error('Ошибка удаления инцидента:', error);
        setError('Не удалось удалить инцидент');
      }
    }
  };

  const handleCloseDeleteConfirmationModal = () => {
    setOpenDeleteConfirmationModal(false);
    window.location.reload(); // Перезагружаем страницу после подтверждения удаления
  };
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
            const incidentTags = incident.tags; // Using tags field from the incident

            if (typeof latitude === 'number' && typeof longitude === 'number') {
              const markerColor = getIncidentColor(incidentTags); // Get color based on tags
              return (
                <Marker
                  key={incident.id}
                  latitude={latitude}
                  longitude={longitude}
                  onClick={() => handleIncidentClick(incident)}
                >
                  <Box sx={{ width: '30px', height: '30px', backgroundColor: markerColor, borderRadius: '50%' }} />
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

              <Typography variant="body1" sx={{ marginTop: '16px', fontWeight: 500 }}>
                Название:{selectedIncident.title || 'Заголовок недоступен'}
              </Typography>

              <Typography variant="body2" sx={{ marginTop: '8px', fontWeight: 400 }}>
               Категория:{selectedIncident.tags || 'Теги недоступны'}
              </Typography>
            

              {/* {selectedEmployee && (
                <Typography variant="body2" sx={{ marginTop: '8px', fontWeight: 500, color: 'green' }}>
                  Назначенный сотрудник: {`${selectedEmployee.name} ${selectedEmployee.surname} (${selectedEmployee.role})`}
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
              </TextField> */}
            </DialogContent>
            <DialogActions>
              {/* <Button onClick={handleSaveIncident} variant="contained" color="primary" sx={{ width: '100%' }}>
                Сохранить
              </Button> */}
              <Button onClick={handleDeleteIncident} variant="contained" color="error" sx={{ width: '100%' }}>
                Удалить инцидент
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}

{openConfirmationModal && (
  <Dialog open={openConfirmationModal} onClose={handleCloseConfirmationModal} fullWidth maxWidth="sm">
    <DialogTitle>Подтверждение</DialogTitle>
    <DialogContent>
      <Typography>Инцидент успешно обновлен.</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseConfirmationModal} variant="contained" color="primary" sx={{ width: '100%' }}>
        OK
      </Button>
    </DialogActions>
  </Dialog>
)}


{openDeleteConfirmationModal && (
  <Dialog open={openDeleteConfirmationModal} onClose={handleCloseDeleteConfirmationModal} fullWidth maxWidth="sm">
    <DialogTitle>Подтверждение удаления</DialogTitle>
    <DialogContent>
      <Typography>Инцидент успешно удален.</Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseDeleteConfirmationModal} variant="contained" color="primary" sx={{ width: '100%' }}>
        OK
      </Button>
    </DialogActions>
  </Dialog>
)}


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