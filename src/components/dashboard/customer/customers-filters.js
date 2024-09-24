import Tabs from '@mui/material/Tabs';  // Импорт компонента Tabs
import Tab from '@mui/material/Tab';    // Импорт компонента Tab
import * as React from 'react';

export function CustomersFilters({ filters = {}, onRoleChange }) {
  const { role } = filters;

  const handleRoleChange = (_, value) => {
    if (typeof onRoleChange === 'function') {
      onRoleChange(value); // Вызываем функцию изменения роли
    }
  };

  // Вкладки для фильтрации по ролям
  const roleTabs = [
    { label: 'All Roles', value: '' }, // Показывать всех сотрудников
    // { label: 'Майор', value: 'manager' },
    // { label: 'Developer', value: 'developer' },
    // { label: 'Analyst', value: 'analyst' },
  ];

  return (
    <div>
      {/* Вкладки для фильтрации по ролям */}
      <Tabs onChange={handleRoleChange} sx={{ px: 3 }} value={role ?? ''} variant="scrollable">
        {roleTabs.map((tab) => (
          <Tab
            key={tab.value}
            label={tab.label}
            tabIndex={0}
            value={tab.value}
          />
        ))}
      </Tabs>
    </div>
  );
}
