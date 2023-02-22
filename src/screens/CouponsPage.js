import React, { useState, useContext, useCallback, useEffect } from 'react';
import ScreenWrapper from '../components/ScreenWrapper';
import Coupons from '../components/Coupons'

export default function SelectGarbageRoom({ navigation }) {
  return (
    <ScreenWrapper navigationShow={false} sideBarShow = {false}>
      <Coupons />
    </ScreenWrapper>
  )

}
