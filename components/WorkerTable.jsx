'use client';

import React, { useEffect, useState } from "react";
import { Button, Input, Modal, Table, Spin } from "antd";
import dayjs from "dayjs";
import { useMutation, useQuery } from "@apollo/client";
import {
  CLOCK_IN,
  CLOCK_OUT,
  FETCH_USER_SHIFTS_BY_WEEK,
} from "@/lib/graphql-operations";

const WorkerTable = ({ getLocation, userLocation }) => {
  const [clockIn, { loading: clockInLoading }] = useMutation(CLOCK_IN);
  const [clockOut, { loading: clockOutLoading }] = useMutation(CLOCK_OUT);
  const [pendingAction, setPendingAction] = useState(null);
  const [pendingRecord, setPendingRecord] = useState(null);
  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [note, setNote] = useState("");
  const today = dayjs().format("DD-MM-YY");
  const formattedToday = dayjs().format("YYYY-MM-DD");

  const { data, loading } = useQuery(FETCH_USER_SHIFTS_BY_WEEK, {
    variables: { date: formattedToday },
    skip: !formattedToday,
  });

  const showModal = (action, record) => {
    setPendingAction(action);
    setPendingRecord(record);
    setOpen(true);
  };

  const generateWeekData = () => {
    const startOfWeek = dayjs().startOf("week").add(1, "days");
    return Array.from({ length: 7 }, (_, i) => {
      const date = startOfWeek.add(i, "day");
      return {
        key: date.format("DD-MM-YY"),
        date: date.format("DD-MM-YY"),
        clock_in: "",
        clock_out: "",
      };
    });
  };

  const fetchWeekData = () => {
    const weekDates = generateWeekData();
    const mergedData = weekDates.map((weekDate) => {
      const existing = data.fetchUserShiftsByWeek.find(
        (d) => d.date === weekDate.date
      );
      return {
        key: weekDate.date,
        date: weekDate.date,
        clock_in: existing?.clock_in || "",
        clock_out: existing?.clock_out || "",
      };
    });

    setDataSource(mergedData);
  };

  useEffect(() => {
    if (!loading && data) {
      fetchWeekData();
    }
  }, [data, loading]);

  const handleClockIn = async (record) => {
    const location = await getLocation();
    const timestamp = dayjs().format("HH:mm:ss");
    try {
      const { data } = await clockIn({
        variables: {
          userLocation: { lat: location.lat, lng: location.lng },
          date: dayjs().toISOString(),
          clock_in_note: note.trim(),
        },
      });

      if (data?.clockIn?.shift?.clock_in) {
        setDataSource((prev) =>
          prev.map((row) =>
            row.key === record.key ? { ...row, clock_in: timestamp } : row
          )
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleClockOut = async (record) => {
    const location = await getLocation();
    const timestamp = dayjs().format("HH:mm:ss");
    try {
      const { data } = await clockOut({
        variables: {
          userLocation: { lat: location.lat, lng: location.lng },
          date: dayjs().toISOString(),
          clock_out_note: note.trim(),
        },
      });

      if (data?.clockOut?.shift?.clock_out) {
        setDataSource((prev) =>
          prev.map((row) =>
            row.key === record.key ? { ...row, clock_out: timestamp } : row
          )
        );
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const handleOk = async () => {
    setConfirmLoading(true);
    try {
      if (pendingAction === "in") {
        await handleClockIn(pendingRecord);
      } else if (pendingAction === "out") {
        await handleClockOut(pendingRecord);
      }
      setOpen(false);
      setNote("");
    } catch (err) {
      console.error(err);
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const columns = [
    { title: "Date", dataIndex: "date", key: "date" },
    {
      title: "Clock In",
      dataIndex: "clock_in",
      key: "clock_in",
      render: (value, record) => {
        if (record.date === today) {
          return value ? (
            value
          ) : (
            <Button
              type="primary"
              disabled={clockInLoading}
              onClick={() => showModal("in", record)}
            >
              {clockInLoading ? "Wait" : "Clock In"}
            </Button>
          );
        }
        return value || "-";
      },
    },
    {
      title: "Clock Out",
      dataIndex: "clock_out",
      key: "clock_out",
      render: (value, record) => {
        if (record.date === today && record.clock_in && !record.clock_out) {
          return (
            <Button
              type="primary"
              disabled={clockOutLoading}
              onClick={() => showModal("out", record)}
            >
              {clockOutLoading ? "Wait" : "Clock Out"}
            </Button>
          );
        }
        return value || "-";
      },
    },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-2 md:px-0 py-4">
      <h1 className="text-xl md:text-2xl font-semibold mb-4 text-gray-800">
        Your Shifts for the Week
      </h1>
      <Spin spinning={loading} tip="Loading...">
        <Table
          dataSource={dataSource}
          columns={columns}
          pagination={false}
          bordered
          size="middle"
          scroll={{ x: true }}
          className="w-full custom-blue-table"
          rowClassName={() => "hover:bg-blue-50"}
        />
      </Spin>
      <Modal
        title="Add a Note (Optional)"
        open={open}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <Input
          placeholder="Send an optional note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </Modal>
      <style jsx global>{`
        .custom-blue-table .ant-table-thead > tr > th {
          background-color: #1677ff;
          color: #fff;
        }
      `}</style>
    </div>
  );
};

export default WorkerTable;
