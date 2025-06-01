import React, { useState } from "react";
import {
  Calendar,
  Select,
  TimePicker,
  Button,
  List,
  Card,
  Typography,
  Modal,
  message,
  Badge,
} from "antd";
import { ClockCircleOutlined, UserOutlined } from "@ant-design/icons";
import dayjs from "dayjs";

const { Title, Text } = Typography;

const BookAppointment = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      doctor: "Dr. Sarah Johnson",
      date: "2024-03-20",
      time: "10:00 AM",
      status: "upcoming",
    },
  ]);

  const doctors = [
    { id: 1, name: "Dr. Sarah Johnson", specialization: "Cardiologist" },
    { id: 2, name: "Dr. Michael Chen", specialization: "Neurologist" },
    { id: 3, name: "Dr. Emily Rodriguez", specialization: "Pediatrician" },
  ];

  const handleBooking = () => {
    if (!selectedDate || !selectedDoctor || !selectedTime) {
      message.error("Please select all required fields");
      return;
    }

    Modal.confirm({
      title: "Confirm Appointment",
      content: (
        <div>
          <p>Doctor: {selectedDoctor}</p>
          <p>Date: {selectedDate.format("YYYY-MM-DD")}</p>
          <p>Time: {selectedTime.format("HH:mm A")}</p>
        </div>
      ),
      onOk: () => {
        const newAppointment = {
          id: appointments.length + 1,
          doctor: selectedDoctor,
          date: selectedDate.format("YYYY-MM-DD"),
          time: selectedTime.format("HH:mm A"),
          status: "upcoming",
        };
        setAppointments([...appointments, newAppointment]);
        message.success("Appointment booked successfully!");
        setSelectedDate(null);
        setSelectedDoctor(null);
        setSelectedTime(null);
      },
    });
  };

  const handleCancel = (id) => {
    Modal.confirm({
      title: "Cancel Appointment",
      content: "Are you sure you want to cancel this appointment?",
      okText: "Yes, Cancel",
      okButtonProps: { danger: true },
      onOk: () => {
        setAppointments(appointments.filter((app) => app.id !== id));
        message.success("Appointment cancelled successfully");
      },
    });
  };

  const dateCellRender = (value) => {
    const date = value.format("YYYY-MM-DD");
    const appointmentsOnDate = appointments.filter((app) => app.date === date);

    return appointmentsOnDate.length > 0 ? (
      <Badge count={appointmentsOnDate.length} color="#129990" />
    ) : null;
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-md">
        <Title level={2} className="text-[#129990] mb-6">
          Book Appointment
        </Title>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Calendar
              fullscreen={false}
              onChange={setSelectedDate}
              value={selectedDate}
              cellRender={dateCellRender}
            />
          </div>
          <div className="space-y-4">
            <Select
              placeholder="Select Doctor"
              style={{ width: "100%" }}
              size="large"
              value={selectedDoctor}
              onChange={setSelectedDoctor}
            >
              {doctors.map((doctor) => (
                <Select.Option key={doctor.id} value={doctor.name}>
                  <div>
                    <Text strong>{doctor.name}</Text>
                    <Text className="block text-gray-500">
                      {doctor.specialization}
                    </Text>
                  </div>
                </Select.Option>
              ))}
            </Select>

            <TimePicker
              format="HH:mm"
              size="large"
              style={{ width: "100%" }}
              value={selectedTime}
              onChange={setSelectedTime}
              minuteStep={30}
              hideDisabledOptions
              disabledHours={() => [0, 1, 2, 3, 4, 5, 6, 20, 21, 22, 23]}
            />

            <Button
              type="primary"
              size="large"
              block
              onClick={handleBooking}
              style={{ background: "#129990" }}
              disabled={!selectedDate || !selectedDoctor || !selectedTime}
            >
              Book Appointment
            </Button>
          </div>
        </div>
      </Card>

      <Card className="shadow-md">
        <Title level={3} className="mb-4">
          Upcoming Appointments
        </Title>
        <List
          dataSource={appointments}
          renderItem={(item) => (
            <List.Item
              actions={[
                <Button
                  type="link"
                  danger
                  onClick={() => handleCancel(item.id)}
                >
                  Cancel
                </Button>,
              ]}
            >
              <List.Item.Meta
                avatar={<UserOutlined className="text-2xl" />}
                title={item.doctor}
                description={
                  <div className="space-y-1">
                    <div>{item.date}</div>
                    <div className="flex items-center text-gray-500">
                      <ClockCircleOutlined className="mr-2" />
                      {item.time}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>
    </div>
  );
};

export default BookAppointment;
