'use client';

import * as React from 'react';
import { fetchApiWithAuth } from '@/lib/auth/custom/client';  // Ensure correct import path
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Popover from '@mui/material/Popover';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { ChatText as ChatTextIcon } from '@phosphor-icons/react';
import { EnvelopeSimple as EnvelopeSimpleIcon } from '@phosphor-icons/react';
import { X as XIcon } from '@phosphor-icons/react';
import { dayjs } from '@/lib/dayjs';

export function NotificationsPopover({ anchorEl, onClose, open = false }) {
  const [incidents, setIncidents] = React.useState([]);
  const [error, setError] = React.useState(null);

  // Fetch incidents and set them in the state
  React.useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const data = await fetchApiWithAuth('http://37.99.82.96:8000/api/v1/incident-web/', { method: 'GET' });
        if (Array.isArray(data)) {
          setIncidents(data);
        }
      } catch (error) {
        setError(error.message);
        console.error('Ошибка при нотификаций:', error);
      }
    };

    fetchIncidents();
    const intervalId = setInterval(fetchIncidents, 30000); // Polling every 30 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  // Handle marking all notifications as read
  const handleMarkAllAsRead = () => {
    // Проверка, если уведомления не имеют поля "read"
    const updatedIncidents = incidents.map((incident) => {
      return { ...incident, read: true }; // Добавляем поле read
    });

    setIncidents([...updatedIncidents]); // Обновляем состояние
  };

  // Handle removing a notification
  const handleRemoveNotification = (id) => {
    const updatedIncidents = incidents.filter((incident) => incident.id !== id);
    setIncidents(updatedIncidents); // Update state to remove the selected incident
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography color="error" variant="body2">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Popover
      anchorEl={anchorEl}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      onClose={onClose}
      open={open}
      slotProps={{ paper: { sx: { width: '380px' } } }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
    >
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center', justifyContent: 'space-between', px: 3, py: 2 }}>
        <Typography variant="h6">Уведомления</Typography>
        <Tooltip title="Mark all as read">
          <IconButton edge="end" onClick={handleMarkAllAsRead}>
            <EnvelopeSimpleIcon />
          </IconButton>
        </Tooltip>
      </Stack>
      {incidents.length === 0 ? (
        <Box sx={{ p: 2 }}>
          <Typography variant="subtitle2">Новых инцидентов нет</Typography>
        </Box>
      ) : (
        <Box sx={{ maxHeight: '270px', overflowY: 'auto' }}>
          <List disablePadding>
            {incidents.map((incident, index) => (
              <NotificationItem
                divider={index < incidents.length - 1}
                key={incident.id}
                notification={incident}
                onRemove={() => handleRemoveNotification(incident.id)}
              />
            ))}
          </List>
        </Box>
      )}
    </Popover>
  );
}

function NotificationItem({ divider, notification, onRemove }) {
  return (
    <ListItem divider={divider} sx={{ alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <NotificationContent notification={notification} />
      <Tooltip title="Remove">
        <IconButton edge="end" onClick={onRemove} size="small">
          <XIcon />
        </IconButton>
      </Tooltip>
    </ListItem>
  );
}

function NotificationContent({ notification }) {
  return (
    <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Avatar>
        <ChatTextIcon fontSize="var(--Icon-fontSize)" />
      </Avatar>
      <div>
        <Typography variant="subtitle2">Новый инцидент</Typography>
        <Typography variant="body2">
          Название: {notification.title || 'No title available'}
        </Typography>
        <Typography variant="body2">
          Reported by: {notification.reporter_name || 'Unknown'}
        </Typography>
        <Typography color="text.secondary" variant="caption">
          {dayjs(notification.createdAt).format('MMM D, hh:mm A')}
        </Typography>
        {notification.read && (
          <Typography variant="caption" color="success.main">
            Прочитано
          </Typography>
        )}
      </div>
    </Stack>
  );
}
