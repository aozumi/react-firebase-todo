import React, { useEffect, useMemo } from 'react';

export const getOnce = (thunk) => useMemo(thunk, []);
export const runOnce = (thunk) => useEffect(thunk, []);
