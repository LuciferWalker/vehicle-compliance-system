export interface StateConfig{
    regex: RegExp;
}

export interface CountryConfig{
    noiseWords: string[];
    states: Record<string, StateConfig>;
}

export const regionConfigs: Record<string, CountryConfig> = {
  //Canada
  CA: {
    noiseWords: [
      "CANADA",
      "ONTARIO",
      "MONTREAL",
      "TEAM-BHP.COM",
      "COPYRIGHT",
      "RESPECTIVE",
      "OWNERS",
      "*"
    ],
    states: {
      ON: {
        regex: /^[A-Z]{4}-\d{3}$/,
      },

      BC: {
        regex: /^([A-Z]{2}\d\s\d{2}[A-Z]|[A-Z0-9]{2,6}|V\d{1,5})$/,
      },
    },
  },

  IN: {
    // defaultRegex: ,
    noiseWords: ["IND"],
    states: {
      GUJ: {
        regex: /^[A-Z]{4}-\d{3}$/,
      },

      MU: {
        regex: /^([A-Z]{2}\d\s\d{2}[A-Z]|[A-Z0-9]{2,6}|V\d{1,5})$/,
      },
    },
  },
};

//Helper function to find a state and its parent country
export function getConfig(state:string){
    for(const [country, config] of Object.entries(regionConfigs)){
        if(config.states[state]){
            return{
                country,
                noiseWords: config.noiseWords,
                stateConfig: config.states
            };
        }
    }
    throw new Error(`State ${state} is not supported.`)
}