import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { useAttendees } from '../hooks/useAttendees';
import { useTables } from '../hooks/useTables';
import { Heart, Users, CheckCircle, XCircle, Clock } from 'lucide-react';

export function DashboardPage() {
  const { attendees, loading: attendeesLoading } = useAttendees();
  const { tables, loading: tablesLoading } = useTables();
  
  const stats = {
    total: attendees.length,
    confirmed: attendees.filter(a => a.rsvp_status === 'confirmed').length,
    declined: attendees.filter(a => a.rsvp_status === 'declined').length,
    pending: attendees.filter(a => a.rsvp_status === 'pending').length,
    plusOnes: attendees.filter(a => a.has_plus_one).length,
  };
  
  const isLoading = attendeesLoading || tablesLoading;
  
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Panel Principal</h1>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-rose-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Total de Invitados</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</h3>
                    <div className="text-xs text-gray-500 mt-1 space-y-1">
                      <p>{stats.total - stats.plusOnes} invitados principales</p>
                      <p>{stats.plusOnes} acompañantes</p>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: '100%' }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Confirmados</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.confirmed}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.total ? Math.round((stats.confirmed / stats.total) * 100) : 0}% de invitados
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${stats.total ? (stats.confirmed / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">No Asistirán</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.declined}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.total ? Math.round((stats.declined / stats.total) * 100) : 0}% de invitados
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                    <XCircle className="h-6 w-6 text-red-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${stats.total ? (stats.declined / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Pendientes</p>
                    <h3 className="text-3xl font-bold text-gray-900 mt-1">{stats.pending}</h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {stats.total ? Math.round((stats.pending / stats.total) * 100) : 0}% de invitados
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center">
                    <Clock className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-amber-500 h-2 rounded-full" 
                      style={{ width: `${stats.total ? (stats.pending / stats.total) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resumen de Mesas</CardTitle>
              </CardHeader>
              <CardContent>
                {tables.length > 0 ? (
                  <div className="space-y-4">
                    {tables.map((table) => {
                      const assignedAttendees = attendees.filter(a => a.table_id === table.id);
                      const percentage = (assignedAttendees.length / table.capacity) * 100;
                      
                      return (
                        <div key={table.id}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-sm font-medium">{table.name}</span>
                            <span className="text-xs text-gray-500">
                              {assignedAttendees.length}/{table.capacity} invitados
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                percentage >= 100 
                                  ? 'bg-amber-500' 
                                  : 'bg-blue-600'
                              }`}
                              style={{ width: `${Math.min(percentage, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No hay mesas creadas aún</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resumen de la Boda</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center h-full py-8">
                  <div className="w-20 h-20 bg-rose-100 rounded-full flex items-center justify-center mb-4">
                    <Heart className="h-10 w-10 text-rose-600" />
                  </div>
                  
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Administración de invitaciones</h3>
                    <p className="text-gray-500 mb-4">
                      Gestiona tus invitados y mesas
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500">Mesas</p>
                        <p className="text-xl font-bold">{tables.length}</p>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-md">
                        <p className="text-xs text-gray-500">Capacidad Total</p>
                        <p className="text-xl font-bold">
                          {tables.reduce((sum, table) => sum + table.capacity, 0)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}