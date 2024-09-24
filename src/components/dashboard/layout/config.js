import { paths } from '@/paths';

export const layoutConfig = {
  navItems: [
    {
      key: 'dashboards',
      title: 'Главное',
      items: [
       
        { key: 'logistics:fleet', title: 'Карта', href: paths.dashboard.logistics.fleet,icon: 'warning-diamond'  },
        
      ],
   
    },
    {
      key: 'general',
      title: 'Меню  ',
      items: [
        
        {
          key: 'customers',
          title: 'Сотрудники',
          icon: 'users',
          items: [
            { key: 'customers', title: 'Список сотрудников', href: paths.dashboard.customers.list },
            { key: 'customers:create', title: 'Создание сотрудника', href: paths.dashboard.customers.create },
            // { key: 'customers:details', title: 'Изменение сотрудника', href: paths.dashboard.customers.details('1') },
          ],
        },
        {
          key: 'incidents',
          title: 'История проишествий',
          icon: 'read-cv-logo',

          items: [
            { key: 'incidents', title: 'Список проишествий', href: paths.dashboard.incidents.list },
            // { key: 'incidents:create', title: 'Create incidents', href: paths.dashboard.incidents.create },
            // { key: 'incidents:details', title: 'Страница проишествий', href: paths.dashboard.incidents.details('1') },
          ],
        },
        
      ],
    },
  
   
  ],
};
