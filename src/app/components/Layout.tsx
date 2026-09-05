import { Outlet, useNavigate, useLocation } from 'react-router';
import { Button } from '../components/ui/button';
import { Home, LayoutDashboard } from 'lucide-react';

export function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1">
        <Outlet />
      </div>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 border-t bg-card">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-around py-3">
            <Button
              variant={location.pathname === '/' ? 'default' : 'ghost'}
              className="flex-1 max-w-[200px]"
              onClick={() => navigate('/')}
            >
              <Home className="h-5 w-5 mr-2" />
              Produits
            </Button>
            <Button
              variant={location.pathname === '/dashboard' ? 'default' : 'ghost'}
              className="flex-1 max-w-[200px]"
              onClick={() => navigate('/dashboard')}
            >
              <LayoutDashboard className="h-5 w-5 mr-2" />
              Mes Plans
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}
