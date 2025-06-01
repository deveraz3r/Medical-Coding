import React from "react";
import { Form, Input, Select, Button, Card, Space, message } from "antd";
import { SyncOutlined } from "@ant-design/icons";

const { TextArea } = Input;

const MedicalNotes = () => {
  const [form] = Form.useForm();

  const onFinish = (values) => {
    console.log("Success:", values);
    message.success("Medical notes saved successfully!");
  };

  const regenerateCodes = () => {
    // Simulating AI code generation
    setTimeout(() => {
      form.setFieldsValue({
        icdCodes: ["A00.0", "B97.29", "J12.82"],
        cptCodes: ["99213", "99214", "86769"],
      });
      message.success("Codes regenerated successfully!");
    }, 1000);
  };

  const mockIcdCodes = [
    { value: "A00.0", label: "A00.0 - Cholera due to Vibrio cholerae" },
    {
      value: "B97.29",
      label: "B97.29 - Other coronavirus as the cause of diseases",
    },
    { value: "J12.82", label: "J12.82 - Pneumonia due to coronavirus disease" },
  ];

  const mockCptCodes = [
    {
      value: "99213",
      label: "99213 - Office/outpatient visit, established patient, 20-29 min",
    },
    {
      value: "99214",
      label: "99214 - Office/outpatient visit, established patient, 30-39 min",
    },
    { value: "86769", label: "86769 - Antibody testing for COVID-19" },
  ];

  return (
    <div className="space-y-6">
      <Card title="Medical Notes" className="max-w-4xl mx-auto">
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            notes: "",
            medications: "",
            icdCodes: [],
            cptCodes: [],
          }}
        >
          <Form.Item
            label="Clinical Notes"
            name="notes"
            rules={[
              { required: true, message: "Please input clinical notes!" },
            ]}
          >
            <TextArea rows={6} placeholder="Enter detailed clinical notes..." />
          </Form.Item>

          <Form.Item
            label="Medications & Treatment Plan"
            name="medications"
            rules={[{ required: true, message: "Please input medications!" }]}
          >
            <TextArea
              rows={4}
              placeholder="Enter medications and treatment plan..."
            />
          </Form.Item>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item
              label="ICD-10 Codes"
              name="icdCodes"
              rules={[
                { required: true, message: "Please select ICD-10 codes!" },
              ]}
            >
              <Select
                mode="multiple"
                placeholder="Select ICD-10 codes"
                options={mockIcdCodes}
                className="w-full"
              />
            </Form.Item>

            <Form.Item
              label="CPT Codes"
              name="cptCodes"
              rules={[{ required: true, message: "Please select CPT codes!" }]}
            >
              <Select
                mode="multiple"
                placeholder="Select CPT codes"
                options={mockCptCodes}
                className="w-full"
              />
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              <Button
                type="default"
                icon={<SyncOutlined />}
                onClick={regenerateCodes}
              >
                Regenerate Codes
              </Button>
              <Button type="primary" htmlType="submit">
                Save Notes
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default MedicalNotes;
