import React from "react";
import { Tabs, Card, Timeline, List, Tag } from "antd";
import {
  ClockCircleOutlined,
  MedicineBoxOutlined,
  FileTextOutlined,
} from "@ant-design/icons";

const PatientHistory = () => {
  const items = [
    {
      key: "summary",
      label: "Summary",
      children: (
        <Card>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                Patient Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Name:</strong> Alice Johnson
                  </p>
                  <p>
                    <strong>Age:</strong> 35
                  </p>
                  <p>
                    <strong>Gender:</strong> Female
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Blood Type:</strong> A+
                  </p>
                  <p>
                    <strong>Height:</strong> 5'6"
                  </p>
                  <p>
                    <strong>Weight:</strong> 140 lbs
                  </p>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Allergies</h3>
              <div className="space-x-2">
                <Tag color="red">Penicillin</Tag>
                <Tag color="red">Peanuts</Tag>
                <Tag color="red">Latex</Tag>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-3">Chronic Conditions</h3>
              <div className="space-x-2">
                <Tag color="blue">Asthma</Tag>
                <Tag color="blue">Hypertension</Tag>
              </div>
            </div>
          </div>
        </Card>
      ),
    },
    {
      key: "visits",
      label: "Past Visits",
      children: (
        <Card>
          <Timeline
            items={[
              {
                color: "green",
                dot: <ClockCircleOutlined className="text-lg" />,
                children: (
                  <div className="mb-4">
                    <p className="font-semibold">Annual Checkup</p>
                    <p className="text-gray-600">March 15, 2024</p>
                    <p>
                      Routine examination, all vitals normal. Prescribed
                      maintenance inhaler.
                    </p>
                  </div>
                ),
              },
              {
                color: "orange",
                dot: <ClockCircleOutlined className="text-lg" />,
                children: (
                  <div className="mb-4">
                    <p className="font-semibold">Emergency Visit</p>
                    <p className="text-gray-600">January 10, 2024</p>
                    <p>
                      Severe asthma attack. Administered emergency treatment.
                    </p>
                  </div>
                ),
              },
              {
                color: "blue",
                dot: <ClockCircleOutlined className="text-lg" />,
                children: (
                  <div className="mb-4">
                    <p className="font-semibold">Follow-up Visit</p>
                    <p className="text-gray-600">December 5, 2023</p>
                    <p>Blood pressure review. Adjusted medication dosage.</p>
                  </div>
                ),
              },
            ]}
          />
        </Card>
      ),
    },
    {
      key: "medications",
      label: "Medications",
      children: (
        <Card>
          <List
            itemLayout="horizontal"
            dataSource={[
              {
                title: "Albuterol Inhaler",
                description: "90mcg, 2 puffs as needed",
                status: "Active",
                prescribed: "March 15, 2024",
              },
              {
                title: "Lisinopril",
                description: "10mg, once daily",
                status: "Active",
                prescribed: "December 5, 2023",
              },
              {
                title: "Prednisone",
                description: "20mg, completed course",
                status: "Completed",
                prescribed: "January 10, 2024",
              },
            ]}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  avatar={
                    <MedicineBoxOutlined className="text-2xl text-[#129990]" />
                  }
                  title={
                    <div className="flex items-center space-x-2">
                      <span>{item.title}</span>
                      <Tag color={item.status === "Active" ? "green" : "gray"}>
                        {item.status}
                      </Tag>
                    </div>
                  }
                  description={
                    <div>
                      <p>{item.description}</p>
                      <p className="text-gray-500">
                        Prescribed: {item.prescribed}
                      </p>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </Card>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <Card title="Patient History">
        <Tabs
          defaultActiveKey="summary"
          items={items}
          className="patient-history-tabs"
        />
      </Card>
    </div>
  );
};

export default PatientHistory;
