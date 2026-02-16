import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Edit, Copy, Pause, Play, Mail, MessageSquare, Bell, Smartphone } from 'lucide-react';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';

import { PageHeader } from '@/components/shared/PageHeader';
import { StatusBadge, type Status } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { mockCampaigns, channelLabels } from '@/data/superData';

const statusConfig: Record<string, { label: string; status: Status }> = {
  active: { label: 'Активна', status: 'success' },
  paused: { label: 'Пауза', status: 'pending' },
  draft: { label: 'Черновик', status: 'info' },
  completed: { label: 'Завершена', status: 'completed' },
};

const channelIcons: Record<string, React.ElementType> = {
  push: Bell,
  email: Mail,
  sms: MessageSquare,
  'in-app': Smartphone,
};

export default function Campaigns() {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [channelFilter, setChannelFilter] = useState<string>('all');

  const filteredCampaigns = mockCampaigns.filter((campaign) => {
    const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
    const matchesChannel = channelFilter === 'all' || campaign.channel === channelFilter;
    return matchesStatus && matchesChannel;
  });

  const handleNewCampaign = () => {
    navigate('/super/campaigns/new');
  };

  const handleDuplicate = (id: string) => {
    toast.success(`Кампания ${id} дублирована`);
  };

  const handleToggleStatus = (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'paused' : 'active';
    toast.success(`Статус кампании изменён на: ${statusConfig[newStatus].label}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Кампании"
        description="CRM-кампании и уведомления пользователей"
        actions={
          <Button onClick={handleNewCampaign}>
            <Plus className="h-4 w-4 mr-2" />
            Новая кампания
          </Button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Статус" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все статусы</SelectItem>
            <SelectItem value="active">Активные</SelectItem>
            <SelectItem value="paused">На паузе</SelectItem>
            <SelectItem value="draft">Черновики</SelectItem>
            <SelectItem value="completed">Завершённые</SelectItem>
          </SelectContent>
        </Select>

        <Select value={channelFilter} onValueChange={setChannelFilter}>
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Канал" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Все каналы</SelectItem>
            <SelectItem value="push">Push</SelectItem>
            <SelectItem value="email">Email</SelectItem>
            <SelectItem value="sms">SMS</SelectItem>
            <SelectItem value="in-app">In-App</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Campaigns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCampaigns.map((campaign) => {
          const ChannelIcon = channelIcons[campaign.channel];
          return (
            <Card key={campaign.id} className="hover:border-primary/50 transition-colors">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <ChannelIcon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{campaign.title}</CardTitle>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {format(new Date(campaign.createdAt), 'd MMM yyyy', { locale: ru })}
                      </p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/super/campaigns/${campaign.id}`)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Редактировать
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDuplicate(campaign.id)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Дублировать
                      </DropdownMenuItem>
                      {campaign.status === 'active' ? (
                        <DropdownMenuItem onClick={() => handleToggleStatus(campaign.id, campaign.status)}>
                          <Pause className="h-4 w-4 mr-2" />
                          Остановить
                        </DropdownMenuItem>
                      ) : campaign.status === 'paused' ? (
                        <DropdownMenuItem onClick={() => handleToggleStatus(campaign.id, campaign.status)}>
                          <Play className="h-4 w-4 mr-2" />
                          Возобновить
                        </DropdownMenuItem>
                      ) : null}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">{campaign.description}</p>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-muted">
                    {channelLabels[campaign.channel]}
                  </span>
                  <StatusBadge
                    status={statusConfig[campaign.status].status}
                    label={statusConfig[campaign.status].label}
                  />
                </div>

                {campaign.sent > 0 && (
                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border">
                    <div>
                      <p className="text-xs text-muted-foreground">Отправлено</p>
                      <p className="font-semibold">{campaign.sent.toLocaleString('ru-RU')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Открыто</p>
                      <p className="font-semibold">{campaign.opened.toLocaleString('ru-RU')}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">CTR</p>
                      <p className="font-semibold text-primary">{campaign.ctr}%</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
