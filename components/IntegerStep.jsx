'use client';

import { Col, InputNumber, Row, Slider } from 'antd';
import React, { useState } from 'react';

const IntegerStep = ({ circleRadius, setCircleRadius }) => {
  const onChange = newValue => {
    setCircleRadius(newValue);
  };

  return (
    <Row>
      <Col span={12}>
        <Slider min={1} max={10} onChange={onChange} value={typeof circleRadius === 'number' ? circleRadius : 0} />
      </Col>
      <Col span={4}>
        <InputNumber min={1} max={10} style={{ margin: '0 16px' }} value={circleRadius} onChange={onChange} />
      </Col>
    </Row>
  );
};

export default IntegerStep;
