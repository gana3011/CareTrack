'use client';

import { FETCH_DASHBOARD_STATS } from '@/lib/graphql-operations';
import { useQuery } from '@apollo/client';
import dayjs from 'dayjs';
import React from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Tooltip,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';
import { Row, Col, Card, Typography, Spin } from 'antd';

const { Title } = Typography;

const DashBoard = () => {
  const today = dayjs().format("YYYY-MM-DD");
  const { data, error, loading } = useQuery(FETCH_DASHBOARD_STATS, {
    variables: { date: today },
  });

  if (loading) return (
    <div className="flex justify-center items-center h-96">
      <Spin tip="Loading..." size="large" />
    </div>
  );

  const avgHoursPerDay = data?.avgHoursPerDay ?? [];
  const peopleClockingInPerDay = data?.peopleClockingInPerDay ?? [];
  const totalHoursPerStaff = data?.totalHoursPerStaff ?? [];

  return (
    <div className="p-6">
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12}>
          <Card className="rounded-2xl text-center shadow-md">
            <Title level={4}>Avg Hours Per Day</Title>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={avgHoursPerDay}
                margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="avg_hours" stroke="#1890ff" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col xs={24} md={12}>
          <Card className="rounded-2xl text-center shadow-md">
            <Title level={4}>People Clocking in Per Day</Title>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={peopleClockingInPerDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="people_count" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      <Row className="mt-6">
        <Col span={24}>
          <Card className="rounded-2xl text-center shadow-md">
            <Title level={4}>Total Hours Per Staff</Title>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                layout="vertical"
                data={totalHoursPerStaff}
                margin={{ top: 20, right: 30, left: 100, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={100} // give space for names
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_hours" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashBoard;
