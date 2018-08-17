// @flow
import { Machine, State } from "xstate";

describe("xstate", () => {
  const stateMachineConfig = {
    initial: 'inactive',
    states: {
      inactive: {
        on: {
          TOGGLE: 'active'
        }
      },
      active: {
        on: {
          TOGGLE: 'inactive'
        }
      }
    }
  };

  it('init state machine', async () => {
    let toggleMachine = Machine(stateMachineConfig);

    let currentState = toggleMachine.initialState;
    expect(currentState.value).toEqual('inactive');
    currentState = toggleMachine.transition(currentState, 'TOGGLE');
    expect(currentState.value).toEqual('active');
    currentState = toggleMachine.transition(currentState, 'TOGGLE');
    expect(currentState.value).toEqual('inactive');
  });

  it('state machine actions', async () => {

    function showLoader(extState, event) {}
    let machineConfig = {
      initial: 'idle',
      states: {
        idle: {
          on: {
            FETCH: {
              pending: {
                actions: ['warmCache', showLoader]
              }
            }
          },

          // onExit actions
          onExit: ['preloadViews']
        },
        pending: {
          onEntry: ['fetchData']
        }
      }
    };
    let machine = Machine(machineConfig);

    let curState = machine.transition(machine.initialState, 'FETCH');
    
    expect(curState.value).toEqual('pending');
    expect(curState.actions).toEqual(expect.arrayContaining([
      'preloadViews',
      'warmCache',
      showLoader,
      'fetchData'
    ]));

  });


}) 

