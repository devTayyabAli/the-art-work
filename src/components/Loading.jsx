import React from "react";
import { DNA, InfinitySpin } from "react-loader-spinner";

export default function Loading() {
  return (
    <div>
      <div
        className="loadingset"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          //   flexDirection: "column",
        }}
      >
        <div>
          <DNA
            visible={true}
            height="200"
            width="200"
            ariaLabel="dna-loading"
            wrapperStyle={{}}
            wrapperClass="dna-wrapper"
          />
        </div>
      </div>
    </div>
  );
}
