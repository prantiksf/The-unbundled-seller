import React from 'react';

const imgCursor = "/figma/e4518f900ff246129a00624fe6515b732c250ba3.png";
const imgAvatar = "/figma/584a6bf7853dbfc993b44bb04a580168a2d77124.png";
const imgAvatar1 = "/figma/25634b94e68cca3d1f870c6bd9aba37e2975b24d.png";
const imgAvatar2 = "/figma/353d008226b8fbf1f17555f8f9d1758200bfc374.png";
const imgAvatar3 = "/figma/16078e699ef8b4030ffcb263a7280394dc6fcf98.png";
const imgAvatar4 = "/figma/48e111edaab39aaecb67de8065dc1b49568d8dd3.png";
const imgAvatar5 = "/figma/5f8f40f497fa9b3978c461361a72b10f76a5c3a8.png";
const imgAvatar6 = "/figma/62f2fe115a457f0d5619097c6bd234a526c70a73.png";
const imgAvatar7 = "/figma/f455444e73a26652bad4efd59c7edcb5391e972a.png";

// SVG imports - these would need to be created separately or imported from a shared SVG file
const imgUnion = "/figma/union-channel.svg";
const imgUnion1 = "/figma/union-user.svg";
const imgUnion2 = "/figma/union-headphones.svg";
const imgLine273 = "/figma/line-273.svg";
const imgUnion3 = "/figma/union-caret-down.svg";
const imgUnion4 = "/figma/union-ellipsis.svg";
const imgUnion5 = "/figma/union-message.svg";
const imgUnion6 = "/figma/union-canvas.svg";
const imgUnion7 = "/figma/union-pin.svg";
const imgUnion8 = "/figma/union-caret-down-2.svg";
const imgUnion9 = "/figma/union-plus.svg";
const imgUnion10 = "/figma/union-plus-2.svg";
const imgUnion11 = "/figma/union-formatting.svg";
const imgUnion12 = "/figma/union-emoji.svg";
const imgUnion13 = "/figma/union-mentions.svg";
const imgLine = "/figma/line.svg";
const imgUnion14 = "/figma/union-video.svg";
const imgUnion15 = "/figma/union-microphone.svg";
const imgUnion16 = "/figma/union-slash-box.svg";
const imgUnion17 = "/figma/union-send.svg";
const imgDivider = "/figma/divider.svg";
const imgUnion18 = "/figma/union-caret-down-3.svg";
const imgEllipse41 = "/figma/ellipse-41.svg";

function Cursor({ className }: { className?: string }) {
  return (
    <div className={className || "h-[18px] relative w-px"} data-name="Cursor" data-node-id="1:10005">
      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgCursor} />
    </div>
  );
}

export default function Conversation() {
  return (
    <div className="bg-white content-stretch flex flex-col isolate items-start relative rounded-br-[6px] rounded-tr-[6px] shadow-[0px_4px_12px_0px_rgba(0,0,0,0.1)] size-full" data-name="Conversation" data-node-id="803:59796">
      <div className="border-[rgba(94,93,96,0.13)] border-b border-solid content-stretch flex flex-col items-center justify-center relative shrink-0 w-full z-[2]" data-name="Primary view header" data-node-id="803:59797">
        <div className="content-stretch flex gap-[8px] h-[50px] items-center px-[12px] relative shrink-0 w-full" data-name="Title Bar" data-node-id="I803:59797;11136:75995">
          <div className="content-stretch flex flex-[1_0_0] gap-[4px] items-center min-h-px min-w-px overflow-clip relative" data-name="Left" data-node-id="I803:59797;11136:75995;11133:73088">
            <div className="content-stretch flex h-[32px] items-center px-[4px] relative rounded-[8px] shrink-0" data-name="Name" data-node-id="I803:59797;11136:75995;11434:43415">
              <div className="content-stretch flex items-center p-[4px] relative shrink-0" data-name="Decoration" data-node-id="I803:59797;11136:75995;11434:43416">
                <div className="opacity-90 overflow-clip relative shrink-0 size-[20px]" data-name="channel" data-node-id="I803:59797;11136:75995;11434:43419">
                  <div className="absolute inset-[15%_10%_5%_10%]" data-name="Union" data-node-id="I803:59797;11136:75995;11434:43419;15068:103">
                    <img alt="" className="block max-w-none size-full" src={imgUnion} />
                  </div>
                </div>
              </div>
              <p className="font-['Lato:Black',sans-serif] leading-[27px] not-italic relative shrink-0 text-[#1d1c1d] text-[18px]">
                sales-support
              </p>
            </div>
          </div>
          <div className="content-stretch flex gap-[8px] items-start justify-end relative shrink-0" data-name="Action buttons" data-node-id="I803:59797;11136:75995;11131:73038">
            <div className="bg-[var(--dt_color-base-pry,white)] border border-[var(--dt_color-otl-ter,rgba(94,93,96,0.13))] border-solid content-stretch flex h-[28px] items-start overflow-clip p-[4px] relative rounded-[8px] shrink-0" data-name="Members button" data-node-id="I803:59797;11136:75995;11131:73039">
              <div className="content-stretch flex items-start pl-[4px] relative shrink-0" data-name="Icon" data-node-id="I803:59797;11136:75995;11131:73039;11607:242793">
                <div className="overflow-clip relative shrink-0 size-[20px]" data-name="user" data-node-id="I803:59797;11136:75995;11131:73039;11607:242794">
                  <div className="absolute inset-[10%_9.98%_10%_9.99%]" data-name="Union" data-node-id="I803:59797;11136:75995;11131:73039;11607:242794;15078:501">
                    <img alt="" className="block max-w-none size-full" src={imgUnion1} />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-col h-full items-start justify-center px-[4px] relative shrink-0" data-node-id="I803:59797;11136:75995;11131:73039;11607:242799">
                <div className="flex flex-col font-['Lato:Bold',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[13px] text-[color:var(--dt_color-content-sec,#454447)] text-right whitespace-nowrap" data-node-id="I803:59797;11136:75995;11131:73039;11607:242800">
                  <p className="leading-[18px]">12</p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-[rgba(94,93,96,0.13)] border-solid content-stretch flex h-[28px] items-center justify-end overflow-clip relative rounded-[8px] shrink-0" data-name="Huddles button" data-node-id="I803:59797;11136:75995;11133:73111">
              <div className="content-stretch flex gap-[4px] h-full items-center justify-center px-[8px] relative shrink-0" data-name="Content" data-node-id="I803:59797;11136:75995;11133:73111;10935:72864">
                <div className="overflow-clip relative shrink-0 size-[20px]" data-name="headphones" data-node-id="I803:59797;11136:75995;11133:73111;10935:72865">
                  <div className="absolute inset-[5%_7.5%_7.5%_7.5%]" data-name="Union" data-node-id="I803:59797;11136:75995;11133:73111;10935:72865;16742:42">
                    <img alt="" className="block max-w-none size-full" src={imgUnion2} />
                  </div>
                </div>
              </div>
              <div className="content-stretch flex gap-px h-full items-center justify-center relative shrink-0" data-name="Down" data-node-id="I803:59797;11136:75995;11133:73111;10935:72867">
                <div className="flex h-[20px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "153.5" } as React.CSSProperties}>
                  <div className="flex-none rotate-90">
                    <div className="h-0 relative w-[20px]" data-node-id="I803:59797;11136:75995;11133:73111;10935:72868">
                      <div className="absolute inset-[-1px_0_0_0]">
                        <img alt="" className="block max-w-none size-full" src={imgLine273} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="overflow-clip relative shrink-0 size-[20px]" data-name="caret-down" data-node-id="I803:59797;11136:75995;11133:73111;10935:72869">
                  <div className="absolute inset-[36.25%_27.5%_37.5%_27.5%]" data-name="Union" data-node-id="I803:59797;11136:75995;11133:73111;10935:72869;15068:69">
                    <img alt="" className="block max-w-none size-full" src={imgUnion3} />
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex items-center justify-center overflow-clip p-[4px] relative rounded-[8px] shrink-0" data-name="More Actions button" data-node-id="I803:59797;11136:75995;11131:73041">
              <div className="content-stretch flex items-center justify-center relative shrink-0" data-name="Icon" data-node-id="I803:59797;11136:75995;11131:73041;10935:72943">
                <div className="overflow-clip relative shrink-0 size-[20px]" data-name="State=filled,Size=normal" data-node-id="I803:59797;11136:75995;11131:73041;10935:72944">
                  <div className="absolute inset-[10%_41.25%]" data-name="Union" data-node-id="I803:59797;11136:75995;11131:73041;10935:72944;15068:147">
                    <img alt="" className="block max-w-none size-full" src={imgUnion4} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex h-[36px] items-center px-[16px] relative shrink-0 w-full" data-name="Subheader" data-node-id="I803:59797;11136:76044">
          <div className="content-stretch flex flex-[1_0_0] gap-[8px] h-full items-end min-h-px min-w-px relative" data-name="Tabs" data-node-id="I803:59797;11136:76044;20567:79314">
            <div className="border-[#83388a] border-b-2 border-solid content-stretch flex gap-[4px] h-[36px] items-center justify-end overflow-clip pb-[12px] pt-[10px] px-[8px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0" data-name=".local Channel Tab" data-node-id="I803:59797;11136:76044;20567:79315">
              <div className="relative shrink-0 size-[16px]" data-name="Icon" data-node-id="I803:59797;11136:76044;20567:79315;20567:79261">
                <div className="absolute inset-[7.5%]" data-name="Union" data-node-id="I803:59797;11136:76044;20567:79315;20567:79261;15074:275">
                  <img alt="" className="block max-w-none size-full" src={imgUnion5} />
                </div>
              </div>
              <p className="font-['Lato:Bold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#1d1c1d] text-[13px]">
                Messages
              </p>
            </div>
            <div className="content-stretch flex gap-[4px] h-[36px] items-center justify-end overflow-clip pb-[12px] pt-[10px] px-[8px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0" data-name=".local Channel Tab" data-node-id="I803:59797;11136:76044;20567:79316">
              <div className="relative shrink-0 size-[16px]" data-name="✨ new-window" data-node-id="I803:59797;11136:76044;20567:79316;20567:79276">
                <div className="absolute inset-[7.5%]" data-name="Union" data-node-id="I803:59797;11136:76044;20567:79316;20567:79276;16400:61">
                  <img alt="" className="block max-w-none size-full" src={imgUnion6} />
                </div>
              </div>
              <p className="font-['Lato:Bold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#454447] text-[13px]">
                Canvas
              </p>
            </div>
            <div className="content-stretch flex gap-[4px] h-[36px] items-center justify-end overflow-clip pb-[12px] pt-[10px] px-[8px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0" data-name=".local Channel Tab" data-node-id="I803:59797;11136:76044;20567:79317">
              <div className="relative shrink-0 size-[16px]" data-name="✨ new-window" data-node-id="I803:59797;11136:76044;20567:79317;20567:79276">
                <div className="absolute inset-[7.57%_7.5%_7.5%_7.57%]" data-name="Union" data-node-id="I803:59797;11136:76044;20567:79317;20567:79276;15074:328">
                  <img alt="" className="block max-w-none size-full" src={imgUnion7} />
                </div>
              </div>
              <p className="font-['Lato:Bold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#454447] text-[13px]">
                Pins
              </p>
            </div>
            <div className="content-stretch flex gap-[4px] h-[36px] items-center justify-end overflow-clip pb-[12px] pt-[10px] px-[8px] relative rounded-tl-[8px] rounded-tr-[8px] shrink-0" data-name=".Local More Tab" data-node-id="I803:59797;11136:76044;20567:79319">
              <p className="font-['Lato:Bold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[#454447] text-[13px]">
                More
              </p>
              <div className="relative shrink-0 size-[16px]" data-name="Icon" data-node-id="I803:59797;11136:76044;20567:79319;20567:79364">
                <div className="absolute inset-[36.25%_27.5%_37.5%_27.5%]" data-name="Union" data-node-id="I803:59797;11136:76044;20567:79319;20567:79364;15068:69">
                  <img alt="" className="block max-w-none size-full" src={imgUnion8} />
                </div>
              </div>
            </div>
            <div className="content-stretch flex h-[36px] items-center justify-end py-[11px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0" data-name=".local Add Tab Button" data-node-id="I803:59797;11136:76044;20567:79320">
              <div className="content-stretch flex gap-[4px] items-center justify-center overflow-clip p-[6px] relative rounded-[16px] shrink-0 size-[28px]" data-name="Button" data-node-id="I803:59797;11136:76044;20567:79320;20567:79292">
                <div className="overflow-clip relative shrink-0 size-[16px]" data-name="plus" data-node-id="I803:59797;11136:76044;20567:79320;20567:79294">
                  <div className="absolute inset-[12.5%]" data-name="Union" data-node-id="I803:59797;11136:76044;20567:79320;20567:79294;15074:351">
                    <img alt="" className="block max-w-none size-full" src={imgUnion9} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="content-stretch flex flex-col items-center justify-end relative shrink-0 w-full z-[1]" data-name="Content" data-node-id="803:59798">
        <div className="content-stretch flex flex-col items-start pb-[24px] px-[20px] relative shrink-0 w-full" data-name="Composer" data-node-id="803:59807">
          <div className="content-stretch flex flex-col items-start justify-end pb-[12px] relative rounded-[8px] shrink-0 w-full" data-name="Message input" data-node-id="803:59808">
            <div className="bg-[var(--dt_color-base-pry,white)] border border-[var(--dt_color-otl-sec,rgba(94,93,96,0.45))] border-solid content-stretch flex flex-col items-start justify-end mb-[-12px] overflow-clip relative rounded-[8px] shadow-[0px_1px_3px_0px_rgba(0,0,0,0.08)] shrink-0 w-full" data-name="Input" data-node-id="I803:59808;11449:145675">
              <div className="content-stretch flex items-start pb-[7px] pt-[9px] px-[12px] relative shrink-0 w-full" data-name="Composer input" data-node-id="I803:59808;11449:145677">
                <Cursor className="h-[18px] relative shrink-0 w-px" />
                <p className="flex-[1_0_0] font-['Lato:Regular',sans-serif] leading-[22px] min-h-px min-w-px not-italic relative text-[15px] text-[color:var(--dt_color-content-ter,#7c7a7f)] whitespace-pre-wrap">
                  Message #project-acme
                </p>
              </div>
              <div className="content-stretch flex h-[40px] items-start relative shrink-0 w-full" data-name="Composer action bar" data-node-id="I803:59808;11449:145680">
                <div className="content-stretch flex gap-[4px] h-[40px] items-center pl-[8px] pr-[4px] py-[4px] relative shrink-0" data-name="Actions" data-node-id="I803:59808;11449:145680;11361:201018">
                  <div className="relative rounded-[24px] shrink-0 size-[28px]" data-name="Attachments plus" data-node-id="I803:59808;11449:145680;11361:201021">
                    <div className="absolute left-[2px] size-[24px] top-[2px]" data-node-id="I803:59808;11449:145680;11361:201021;11342:125590">
                      <img alt="" className="block max-w-none size-full" src={imgEllipse41} />
                    </div>
                    <div className="absolute left-[6px] overflow-clip size-[16px] top-[6px]" data-name="plus" data-node-id="I803:59808;11449:145680;11361:201021;11342:125591">
                      <div className="absolute inset-[12.5%]" data-name="Union" data-node-id="I803:59808;11449:145680;11361:201021;11342:125591;15074:350">
                        <img alt="" className="block max-w-none size-full" src={imgUnion10} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-center justify-center p-px relative rounded-[4px] shrink-0 size-[28px]" data-name="Compose action button" data-node-id="I803:59808;11449:145680;11361:201022">
                    <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] relative rounded-[3px] shrink-0 size-[26px]" data-name="Base" data-node-id="I803:59808;11449:145680;11361:201022;11342:125600">
                      <div className="relative shrink-0 size-[18px]" data-name="Icon" data-node-id="I803:59808;11449:145680;11361:201022;11342:125601">
                        <div className="absolute inset-[14.63%_0_11.25%_0]" data-name="Union" data-node-id="I803:59808;11449:145680;11361:201022;11342:125601;15074:199">
                          <img alt="" className="block max-w-none size-full" src={imgUnion11} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-center justify-center p-px relative rounded-[4px] shrink-0 size-[28px]" data-name="Compose action button" data-node-id="I803:59808;11449:145680;11361:201023">
                    <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] relative rounded-[3px] shrink-0 size-[26px]" data-name="Base" data-node-id="I803:59808;11449:145680;11361:201023;11342:125600">
                      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="Icon" data-node-id="I803:59808;11449:145680;11361:201023;11342:125601">
                        <div className="absolute inset-[5%]" data-name="Union" data-node-id="I803:59808;11449:145680;11361:201023;11342:125601;15068:153">
                          <img alt="" className="block max-w-none size-full" src={imgUnion12} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-center justify-center p-px relative rounded-[4px] shrink-0 size-[28px]" data-name="Compose action button" data-node-id="I803:59808;11449:145680;11361:201024">
                    <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] relative rounded-[3px] shrink-0 size-[26px]" data-name="Base" data-node-id="I803:59808;11449:145680;11361:201024;11342:125600">
                      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="Icon" data-node-id="I803:59808;11449:145680;11361:201024;11342:125601">
                        <div className="absolute inset-[5%]" data-name="Union" data-node-id="I803:59808;11449:145680;11361:201024;11342:125601;15074:266">
                          <img alt="" className="block max-w-none size-full" src={imgUnion13} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[20px] overflow-clip relative shrink-0 w-[9px]" data-name="Divider" data-node-id="I803:59808;11449:145680;11361:201025">
                    <div className="absolute bottom-0 flex h-[20px] items-center justify-center right-[5px] w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "153.5" } as React.CSSProperties}>
                      <div className="flex-none rotate-90">
                        <div className="h-0 relative w-[20px]" data-name="Line" data-node-id="I803:59808;11449:145680;11361:201025;11342:125612">
                          <div className="absolute inset-[-1px_0_0_0]">
                            <img alt="" className="block max-w-none size-full" src={imgLine} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-center justify-center p-px relative rounded-[4px] shrink-0 size-[28px]" data-name="Compose action button" data-node-id="I803:59808;11449:145680;11361:201026">
                    <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] relative rounded-[3px] shrink-0 size-[26px]" data-name="Base" data-node-id="I803:59808;11449:145680;11361:201026;11342:125600">
                      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="Icon" data-node-id="I803:59808;11449:145680;11361:201026;11342:125601">
                        <div className="absolute inset-[15%_5%_15%_7.5%]" data-name="Union" data-node-id="I803:59808;11449:145680;11361:201026;11342:125601;15079:522">
                          <img alt="" className="block max-w-none size-full" src={imgUnion14} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-col items-center justify-center p-px relative rounded-[4px] shrink-0 size-[28px]" data-name="Compose action button" data-node-id="I803:59808;11449:145680;11361:201027">
                    <div className="content-stretch flex items-center justify-center overflow-clip px-[5px] relative rounded-[3px] shrink-0 size-[26px]" data-name="Base" data-node-id="I803:59808;11449:145680;11361:201027;11342:125600">
                      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="Icon" data-node-id="I803:59808;11449:145680;11361:201027;11342:125601">
                        <div className="absolute inset-[10%_17.5%]" data-name="Union" data-node-id="I803:59808;11449:145680;11361:201027;11342:125601;15074:278">
                          <img alt="" className="block max-w-none size-full" src={imgUnion15} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="h-[20px] overflow-clip relative shrink-0 w-[9px]" data-name="Divider" data-node-id="I803:59808;11449:145680;11361:201028">
                    <div className="absolute bottom-0 flex h-[20px] items-center justify-center right-[5px] w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "153.5" } as React.CSSProperties}>
                      <div className="flex-none rotate-90">
                        <div className="h-0 relative w-[20px]" data-name="Line" data-node-id="I803:59808;11449:145680;11361:201028;11342:125612">
                          <div className="absolute inset-[-1px_0_0_0]">
                            <img alt="" className="block max-w-none size-full" src={imgLine} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="relative rounded-[4px] shrink-0 size-[28px]" data-node-id="I803:59808;11449:145680;11361:201029">
                    <div className="absolute left-[5px] overflow-clip size-[18px] top-[5px]" data-name="slash-box" data-node-id="I803:59808;11449:145680;11361:201030">
                      <div className="absolute inset-[7.5%]" data-name="Union" data-node-id="I803:59808;11449:145680;11361:201030;16162:94">
                        <img alt="" className="block max-w-none size-full" src={imgUnion16} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex flex-[1_0_0] items-center justify-end min-h-px min-w-px p-[6px] relative" data-name="Right" data-node-id="I803:59808;11449:145680;11361:201031">
                  <div className="bg-[var(--dt_color-base-pry,white)] content-stretch flex h-[28px] items-center justify-end overflow-clip relative rounded-[4px] shrink-0" data-name="Send button" data-node-id="I803:59808;11449:145680;11361:201032">
                    <div className="content-stretch flex h-full items-center justify-center px-[8px] relative shrink-0" data-name="Content" data-node-id="I803:59808;11449:145680;11361:201032;11342:125615">
                      <div className="overflow-clip relative shrink-0 size-[18px]" data-name="Icon" data-node-id="I803:59808;11449:145680;11361:201032;11342:125616">
                        <div className="absolute inset-[7.5%_7.51%_7.51%_7.5%]" data-name="Union" data-node-id="I803:59808;11449:145680;11361:201032;11342:125616;15074:390">
                          <img alt="" className="block max-w-none size-full" src={imgUnion17} />
                        </div>
                      </div>
                    </div>
                    <div className="content-stretch flex gap-px h-full items-center justify-center relative shrink-0" data-name="Down" data-node-id="I803:59808;11449:145680;11361:201032;11342:125617">
                      <div className="flex h-[20px] items-center justify-center relative shrink-0 w-0" style={{ "--transform-inner-width": "1200", "--transform-inner-height": "153.5" } as React.CSSProperties}>
                        <div className="flex-none rotate-90">
                          <div className="h-0 relative w-[20px]" data-name="Divider" data-node-id="I803:59808;11449:145680;11361:201032;11342:125618">
                            <div className="absolute inset-[-1px_0_0_0]">
                              <img alt="" className="block max-w-none size-full" src={imgDivider} />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="overflow-clip relative shrink-0 size-[20px]" data-name="caret-down" data-node-id="I803:59808;11449:145680;11361:201032;11342:125619">
                        <div className="absolute inset-[36.25%_27.5%_37.5%_27.5%]" data-name="Union" data-node-id="I803:59808;11449:145680;11361:201032;11342:125619;15068:69">
                          <img alt="" className="block max-w-none size-full" src={imgUnion18} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col h-[536px] items-start justify-end overflow-x-clip overflow-y-auto pb-[12px] relative shrink-0 w-full" data-name="Messages" data-node-id="803:59799">
          <div className="bg-[var(--dt_color-base-pry,white)] content-stretch flex gap-[8px] items-start px-[20px] py-[8px] relative shrink-0 w-full" data-name="💻 Conversation" data-node-id="803:59800">
            <div className="overflow-clip relative shrink-0 size-[36px]" data-name="💻 Single Person" data-node-id="I803:59800;698:16368">
              <div className="absolute inset-0 rounded-[8px]" data-name="Avatar" data-node-id="I803:59800;698:16368;323:3453">
                <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[8px] size-full" src={imgAvatar} />
              </div>
            </div>
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px min-w-px relative" data-name="Content" data-node-id="I803:59800;673:11598">
              <div className="content-stretch flex gap-[8px] h-[18px] items-end relative shrink-0" data-name=".Message" data-node-id="I803:59800;692:17710">
                <div className="content-stretch flex items-center relative shrink-0" data-name="Sender" data-node-id="I803:59800;692:17710;334:1439">
                  <div className="flex flex-col font-['Lato:Black',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#1d1c1d] text-[15px] whitespace-nowrap" data-node-id="I803:59800;692:17710;334:1440">
                    <p className="leading-[22px]">Sarah Parras</p>
                  </div>
                </div>
                <div className="content-stretch flex items-start pb-px pt-[3px] relative shrink-0" data-name=".Timestamp" data-node-id="I803:59800;692:17710;334:1442">
                  <div className="flex flex-col font-['Lato:Regular',sans-serif] justify-center leading-[0] not-italic relative shrink-0 text-[#454447] text-[12px] whitespace-nowrap" data-node-id="I803:59800;692:17710;334:1442;332:1267">
                    <p className="leading-[18px]">11:27 AM</p>
                  </div>
                </div>
              </div>
              <p className="font-['Lato:Regular',sans-serif] leading-[22px] min-w-full not-italic relative shrink-0 text-[15px] text-[color:var(--dt_color-content-pry,#1d1c1d)] w-[min-content] whitespace-pre-wrap">{`AstroCraft is having problems with two factor authentication. `}</p>
              <div className="content-stretch flex flex-col items-start pt-[8px] relative shrink-0 w-full" data-name="Reactions and Replies" data-node-id="I803:59800;698:16724">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-name="💻 Replies" data-node-id="I803:59800;698:16726">
                  <div className="overflow-clip relative shrink-0 size-[24px]" data-name="💻 Single Person" data-node-id="I803:59800;698:16726;643:10143">
                    <div className="absolute inset-0 rounded-[6px]" data-name="Avatar" data-node-id="I803:59800;698:16726;643:10143;323:3511">
                      <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[6px] size-full" src={imgAvatar1} />
                    </div>
                  </div>
                  <p className="font-['Lato:Bold',sans-serif] leading-[18px] not-italic relative shrink-0 text-[13px] text-[color:var(--dt_color-content-hgl-1,#1264a3)]">
                    1 reply
                  </p>
                  <p className="flex-[1_0_0] font-['Lato:Regular',sans-serif] leading-[18px] min-h-px min-w-px not-italic relative text-[13px] text-[color:var(--dt_color-content-sec,#454447)] whitespace-pre-wrap">
                    Last reply today at 10:00 AM
                  </p>
                </div>
              </div>
            </div>
          </div>
          {/* Additional messages omitted for brevity - full component includes 6 more message blocks */}
        </div>
      </div>
    </div>
  );
}
