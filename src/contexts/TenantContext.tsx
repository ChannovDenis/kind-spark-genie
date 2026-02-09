import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Tenant {
  id: string;
  name: string;
  logo: string;
  accentColor: string;
  plan: 'starter' | 'business' | 'enterprise';
  usersCount: number;
  status: 'active' | 'trial' | 'suspended';
}

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'partner_admin' | 'expert' | 'quality_manager' | 'super_admin';
}

interface TenantContextType {
  currentTenant: Tenant;
  setCurrentTenant: (tenant: Tenant) => void;
  tenants: Tenant[];
  currentUser: CurrentUser;
}

const defaultTenants: Tenant[] = [
  {
    id: 'dobroservice',
    name: 'Добросервис',
    logo: '🏠',
    accentColor: '#3B82F6',
    plan: 'enterprise',
    usersCount: 12500,
    status: 'active',
  },
  {
    id: 'tenant-a',
    name: 'Тенант A',
    logo: '🏢',
    accentColor: '#10B981',
    plan: 'enterprise',
    usersCount: 45000,
    status: 'active',
  },
  {
    id: 'tenant-b',
    name: 'Тенант B',
    logo: '📦',
    accentColor: '#8B5CF6',
    plan: 'business',
    usersCount: 8200,
    status: 'active',
  },
  {
    id: 'tenant-c',
    name: 'Тенант C',
    logo: '🏥',
    accentColor: '#F59E0B',
    plan: 'starter',
    usersCount: 3400,
    status: 'trial',
  },
];

const defaultUser: CurrentUser = {
  id: 'user-1',
  name: 'Demo User',
  email: 'demo@example.com',
  avatar: '',
  role: 'partner_admin',
};

const TenantContext = createContext<TenantContextType | undefined>(undefined);

export function TenantProvider({ children }: { children: ReactNode }) {
  const [currentTenant, setCurrentTenant] = useState<Tenant>(defaultTenants[0]);
  const [currentUser] = useState<CurrentUser>(defaultUser);

  return (
    <TenantContext.Provider
      value={{
        currentTenant,
        setCurrentTenant,
        tenants: defaultTenants,
        currentUser,
      }}
    >
      {children}
    </TenantContext.Provider>
  );
}

export function useTenant() {
  const context = useContext(TenantContext);
  if (context === undefined) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  return context;
}
