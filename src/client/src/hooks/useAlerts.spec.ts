import { renderHook } from '@testing-library/react-hooks';
import { useAlerts } from './useAlerts';

const OVER_LIMIT_LOAD = 1.5;
const UNDER_LIMIT_LOAD = 0.5;

describe("useAlerts hook", () => {

  it("should initialize with non-alert status", () => {
    const { result } = renderHook(() => useAlerts(UNDER_LIMIT_LOAD));
    expect(result.current.isAlert).toBe(false);
  })

  it("should initialize with 0 consecutive high data points and 0 consecutive low data points", () => {
    const { result } = renderHook(() => useAlerts(UNDER_LIMIT_LOAD));
    expect(result.current.consecutiveHighs).toBe(0);
    expect(result.current.consecutiveLows).toBe(1);
  })

  it("should initialize with 0 alerts and 0 recoveries", () => {
    const { result } = renderHook(() => useAlerts(UNDER_LIMIT_LOAD));
    expect(result.current.alertsAmount).toBe(0);
    expect(result.current.recoveryAmount).toBe(0);
  })

  describe("high cpu load data point is processed", () => {

    it("should update consecutiveHighs if a high data point is processed", () => {
      const { result } = renderHook(({ defaults }) => useAlerts(OVER_LIMIT_LOAD, defaults),   {
        initialProps: {
          defaults: {
            defaultConsecutiveHighs: 5
          }
        },
      })
      expect(result.current.consecutiveHighs).toBe(6);
    })
  
    it("should reset consecutive lows to 0 if a high data point is processed", () => {
      const { result } = renderHook(({ defaults }) => useAlerts(OVER_LIMIT_LOAD, defaults),   {
        initialProps: {
          defaults: {
            defaultConsecutiveLows: 25
          }
        },
      })
      expect(result.current.consecutiveLows).toBe(0);
    })

    it("should NOT trigger the alert status if the cpu load surpasses the threshold for less than two minutes", () => {
      const { result } = renderHook(({ defaults }) => useAlerts(OVER_LIMIT_LOAD, defaults),   {
        initialProps: {
          defaults: {
            defaultConsecutiveHighs: 5,
            defaultIsAlert: false
          }
        },
      })
      expect(result.current.isAlert).toBe(false);
    })
    
    it("should trigger the alert status if the the cpu load surpasses the threshold for two minutes", () => {
      const { result } = renderHook(({ defaults }) => useAlerts(OVER_LIMIT_LOAD, defaults),   {
        initialProps: {
          defaults: {
            // 12 data points equal 2 minutes (11 datapoints + current point being processed)
            defaultConsecutiveHighs: 11,
            defaultIsAlert: false
          }
        },
      })
      expect(result.current.isAlert).toBe(true);
    })

  })

  describe("low cpu load data point is processed", () => {
    it("should update consecutiveLows if a low data point is processed", () => {
      const { result } = renderHook(({ defaults }) => useAlerts(UNDER_LIMIT_LOAD, defaults),   {
        initialProps: {
          defaults: {
            defaultConsecutiveLows: 8
          }
        },
      })
      expect(result.current.consecutiveLows).toBe(9);
    })
  
    it("should reset consecutiveHighs to 0 if a low data point is processed", () => {
      const { result } = renderHook(({ defaults }) => useAlerts(UNDER_LIMIT_LOAD, defaults),   {
        initialProps: {
          defaults: {
            defaultConsecutiveHighs: 99
          }
        },
      })
      expect(result.current.consecutiveHighs).toBe(0);
    })

    it("should NOT switch the alert status back to false if the cpu load is under the threshold for less than two minutes", () => {
      const { result } = renderHook(({ defaults }) => useAlerts(UNDER_LIMIT_LOAD, defaults),   {
        initialProps: {
          defaults: {
            defaultConsecutiveLows: 8,
            defaultIsAlert: true
          }
        },
      })
      expect(result.current.isAlert).toBe(true);
    })

    it("should switch the alert status back to false if the the cpu load is under the threshold for two minutes", () => {
      const { result } = renderHook(({ defaults }) => useAlerts(UNDER_LIMIT_LOAD, defaults),   {
        initialProps: {
          defaults: {
            defaultConsecutiveLows: 11,
            defaultIsAlert: true
          }
        },
      })
      expect(result.current.isAlert).toBe(false);
    })

  })


})


// const { result } = renderHook(({ defaults }) => useAlerts(OVER_LIMIT_LOAD, defaults),   {
//   initialProps: {
//     defaults: {
//       defaultIsAlert: false
//     }
//   },
// })