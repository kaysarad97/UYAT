import { ProductsFilters } from './product-filters';
import { ProductsTable } from './product-table';
import { useState } from 'react';

export default function IncidentPage() {
  const [filters, setFilters] = useState({});

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters); // Обновляем фильтры при изменении
  };

  return (
    <div>
      {/* Фильтры */}
      <ProductsFilters filters={filters} onFiltersChange={handleFiltersChange} />

      {/* Таблица инцидентов с фильтрацией */}
      <ProductsTable filters={filters} />
    </div>
  );
}
