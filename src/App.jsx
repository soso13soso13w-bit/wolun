import React, { useState } from 'react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [depositorName, setDepositorName] = useState('');
  const [sajuForm, setSajuForm] = useState({
    name: '',
    birthDate: '',
    calendarType: 'solar',
    birthTime: 'unknown',
    question: ''
  });
  const [validationError, setValidationError] = useState('');
  const [paymentStep, setPaymentStep] = useState('checkout'); // 'checkout', 'complete'
  const [readingResult, setReadingResult] = useState(null);

  // 수정된 입금 계좌 정보
  const myAccount = {
    bank: '토스뱅크',
    accountNumber: '1002-1526-1128',
    holder: '송시우'
  };

  const products = [
    { id: 'free', name: '오늘의 한 줄 운세', price: 0, desc: '매일 확인하는 가벼운 마음의 나침반' },
    { id: 'custom', name: '맞춤 사주 리딩', price: 3900, desc: '오행과 성향을 기반으로 한 디테일한 분석' },
    { id: 'comprehensive', name: '종합 사주 리딩', price: 9900, desc: '연애, 재물, 직업운까지 아우르는 심층 풀이' },
    { id: 'ai', name: 'AI 심층 상담', price: 4900, desc: '고민에 맞춘 1:1 심층 맞춤형 조언' },
  ];

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setSajuForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSajuSubmit = (e) => {
    e.preventDefault();
    if (!sajuForm.name.trim()) {
      setValidationError('이름 또는 별칭을 입력해주세요.');
      return;
    }
    if (!sajuForm.birthDate) {
      setValidationError('생년월일을 입력해주세요.');
      return;
    }
    setValidationError('');
    
    setReadingResult({
      name: sajuForm.name,
      personality: '당신은 깊은 통찰력과 따뜻한 감성을 동시에 지닌 분입니다. 주변 사람들에게 선한 영향력을 주며, 세심한 관찰력으로 기회를 포착하는 능력이 뛰어납니다.',
      fiveElements: '목(木)과 화(火)의 기운이 조화롭게 어우러져 있어 표현력이 풍부하고 새로운 도전을 즐기는 성향입니다.',
      romance: '진실된 인연을 중요하게 생각합니다. 상대방의 작은 배려에 크게 감동하며, 안정적이고 깊은 교감을 나누는 연애를 선호합니다.',
      wealth: '꾸준하고 성실한 자산 관리가 빛을 발하는 구조입니다. 감정적인 소비를 줄이고 장기적인 가치에 투자할 때 재물이 안정적으로 늘어납니다.',
      career: '창의적인 아이디어를 발휘하거나 사람들과 소통하는 분야에서 큰 성취를 이룰 수 있습니다.',
      dailyFortune: '오늘은 마음의 여유를 가지고 주변을 둘러보기에 좋은 날입니다.',
      advice: '주변의 시선보다는 본인의 내면의 목소리에 귀를 기울여보세요.'
    });

    setCurrentPage('result');
  };

  const handleStartPayment = (product) => {
    setSelectedProduct(product);
    setDepositorName('');
    setPaymentStep('checkout');
    setCurrentPage('payment');
  };

  const handleConfirmDeposit = () => {
    if (!depositorName.trim()) {
      alert('입금자명을 입력해 주세요.');
      return;
    }
    setPaymentStep('complete');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b132b', color: '#f8fafc', paddingBottom: '60px' }}>
      {/* 상단 내비게이션 */}
      <header style={{ position: 'sticky', top: 0, zIndex: 50, backgroundColor: 'rgba(11, 19, 43, 0.9)', borderBottom: '1px solid rgba(245, 158, 11, 0.2)', backdropFilter: 'blur(8px)' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 20px', height: '70px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button 
            onClick={() => setCurrentPage('home')} 
            style={{ background: 'none', border: 'none', color: '#fef3c7', fontSize: '20px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <span>🌙</span> 월운 (月運)
          </button>
          
          <nav style={{ display: 'flex', gap: '24px', fontSize: '15px' }}>
            <button onClick={() => setCurrentPage('home')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>홈</button>
            <button onClick={() => setCurrentPage('input')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>사주 보기</button>
            <button onClick={() => setCurrentPage('products')} style={{ background: 'none', border: 'none', color: '#cbd5e1', cursor: 'pointer' }}>유료 상품</button>
          </nav>

          <button 
            onClick={() => setCurrentPage('input')}
            style={{ padding: '10px 18px', background: 'linear-gradient(to right, #d97706, #f59e0b)', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '14px' }}
          >
            무료 운세 시작
          </button>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '40px 20px' }}>
        {currentPage === 'home' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '60px' }}>
            <div style={{ textAlign: 'center', padding: '60px 20px', background: 'linear-gradient(to bottom, rgba(28, 37, 65, 0.5), transparent)', borderRadius: '24px', border: '1px solid rgba(245, 158, 11, 0.1)' }}>
              <div style={{ display: 'inline-block', padding: '6px 16px', borderRadius: '20px', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: '#fcd34d', fontSize: '13px', marginBottom: '20px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                ✨ 달의 흐름을 읽는 지혜
              </div>
              <h1 style={{ fontSize: '38px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '20px' }}>
                당신의 운명에 비치는 은은한 달빛
              </h1>
              <p style={{ color: '#94a3b8', maxWidth: '550px', margin: '0 auto 30px auto', lineHeight: '1.6', fontSize: '16px' }}>
                동양 명리학의 깊이와 현대적 통찰이 만나는 곳.<br />월운(月運)과 함께 삶의 길목에서 지혜로운 길을 찾아보세요.
              </p>
              <button 
                onClick={() => setCurrentPage('input')}
                style={{ padding: '16px 32px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '16px' }}
              >
                무료 운세 시작하기 ➔
              </button>
            </div>

            <div>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '24px', textAlign: 'center' }}>월운 추천 서비스</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px' }}>
                {products.map(p => (
                  <div key={p.id} style={{ backgroundColor: 'rgba(28, 37, 65, 0.4)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '10px' }}>{p.name}</h3>
                      <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '20px', lineHeight: '1.5' }}>{p.desc}</p>
                    </div>
                    <div>
                      <div style={{ color: '#fcd34d', fontWeight: 'bold', marginBottom: '16px' }}>
                        {p.price === 0 ? '무료' : `${p.price.toLocaleString()}원`}
                      </div>
                      <button 
                        onClick={() => p.price === 0 ? setCurrentPage('input') : handleStartPayment(p)}
                        style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', color: '#f8fafc', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '8px', cursor: 'pointer', fontWeight: '600', fontSize: '14px' }}
                      >
                        {p.price === 0 ? '바로 확인하기' : '신청하기'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {currentPage === 'products' && (
          <div>
            <h2 style={{ fontSize: '28px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '10px', textAlign: 'center' }}>프리미엄 사주 상품</h2>
            <p style={{ color: '#94a3b8', textAlign: 'center', marginBottom: '40px', fontSize: '14px' }}>원하시는 심층 분석 상품을 신청해 보세요.</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px' }}>
              {products.map(p => (
                <div key={p.id} style={{ backgroundColor: 'rgba(28, 37, 65, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '30px', borderRadius: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '12px' }}>{p.name}</h3>
                    <p style={{ fontSize: '14px', color: '#94a3b8', marginBottom: '24px', lineHeight: '1.6' }}>{p.desc}</p>
                  </div>
                  <div>
                    <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '20px' }}>
                      {p.price === 0 ? '무료' : `${p.price.toLocaleString()}원`}
                    </div>
                    <button 
                      onClick={() => p.price === 0 ? setCurrentPage('input') : handleStartPayment(p)}
                      style={{ width: '100%', padding: '14px', backgroundColor: p.price === 0 ? '#334155' : '#f59e0b', color: p.price === 0 ? '#fff' : '#0f172a', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {p.price === 0 ? '무료 이용' : '무통장 입금 신청'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {currentPage === 'input' && (
          <div style={{ maxWidth: '550px', margin: '0 auto', backgroundColor: 'rgba(28, 37, 65, 0.5)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '40px', borderRadius: '24px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#fef3c7', marginBottom: '8px', textAlign: 'center' }}>사주 정보 입력</h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', textAlign: 'center', marginBottom: '30px' }}>정밀한 풀이를 위해 정확한 정보를 입력해 주세요.</p>
            
            {validationError && (
              <div style={{ marginBottom: '20px', padding: '12px', backgroundColor: 'rgba(127, 29, 29, 0.4)', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '10px', color: '#fca5a5', fontSize: '14px' }}>
                ⚠️ {validationError}
              </div>
            )}

            <form onSubmit={handleSajuSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>이름 또는 별칭</label>
                <input 
                  type="text" 
                  name="name" 
                  value={sajuForm.name} 
                  onChange={handleFormChange}
                  placeholder="홍길동"
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>생년월일</label>
                <input 
                  type="date" 
                  name="birthDate" 
                  value={sajuForm.birthDate} 
                  onChange={handleFormChange}
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>양/음력</label>
                  <select 
                    name="calendarType" 
                    value={sajuForm.calendarType} 
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="solar">양력</option>
                    <option value="lunar">음력</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>태어난 시간</label>
                  <select 
                    name="birthTime" 
                    value={sajuForm.birthTime} 
                    onChange={handleFormChange}
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                  >
                    <option value="unknown">모름</option>
                    <option value="morning">오전 (06:00 ~ 11:59)</option>
                    <option value="afternoon">오후 (12:00 ~ 17:59)</option>
                    <option value="night">야간/새벽</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>상담하고 싶은 질문 (선택)</label>
                <textarea 
                  name="question" 
                  value={sajuForm.question} 
                  onChange={handleFormChange}
                  placeholder="예: 다가오는 이직이나 연애운이 궁금합니다."
                  rows="3"
                  style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.2)', borderRadius: '10px', color: '#fff', resize: 'none', boxSizing: 'border-box' }}
                ></textarea>
              </div>

              <button 
                type="submit"
                style={{ width: '100%', padding: '15px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer', fontSize: '16px', marginTop: '10px' }}
              >
                사주 분석 시작하기
              </button>
            </form>
          </div>
        )}

        {currentPage === 'result' && readingResult && (
          <div style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.5)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '40px', borderRadius: '24px', textAlign: 'center' }}>
              <span style={{ color: '#fcd34d', fontSize: '14px', fontWeight: '600' }}>월운(月運) 사주 풀이 결과</span>
              <h2 style={{ fontSize: '30px', fontWeight: 'bold', color: '#fef3c7', margin: '10px 0 20px 0' }}>{readingResult.name}님의 사주 리딩</h2>
              <p style={{ color: '#cbd5e1', fontSize: '15px', lineHeight: '1.7', maxWidth: '600px', margin: '0 auto' }}>{readingResult.personality}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.3)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px' }}>🔥 오행과 음양</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.fiveElements}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.3)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px' }}>💖 연애와 대인관계</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.romance}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.3)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px' }}>💰 재물과 소비 습관</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.wealth}</p>
              </div>
              <div style={{ backgroundColor: 'rgba(28, 37, 65, 0.3)', border: '1px solid rgba(245, 158, 11, 0.2)', padding: '24px', borderRadius: '16px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#fcd34d', marginBottom: '12px' }}>💼 직업과 진로</h3>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>{readingResult.career}</p>
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button 
                onClick={() => setCurrentPage('home')}
                style={{ padding: '14px 32px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
              >
                처음으로 돌아가기
              </button>
            </div>
          </div>
        )}

        {/* 무통장 입금 안내 결제 화면 */}
        {currentPage === 'payment' && selectedProduct && (
          <div style={{ maxWidth: '480px', margin: '0 auto', backgroundColor: 'rgba(28, 37, 65, 0.6)', border: '1px solid rgba(245, 158, 11, 0.3)', padding: '36px', borderRadius: '24px' }}>
            {paymentStep === 'checkout' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fef3c7', textAlign: 'center' }}>무통장 입금 신청</h2>
                
                <div style={{ padding: '16px', backgroundColor: '#0b132b', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8' }}>선택한 상품</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#fef3c7', marginTop: '4px' }}>{selectedProduct.name}</div>
                  <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fcd34d', marginTop: '4px' }}>{selectedProduct.price.toLocaleString()}원</div>
                </div>

                <div style={{ padding: '18px', backgroundColor: 'rgba(245, 158, 11, 0.08)', borderRadius: '14px', border: '1px dashed rgba(245, 158, 11, 0.4)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ fontSize: '13px', color: '#fcd34d', fontWeight: 'bold' }}>💳 입금 계좌 정보</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#fff' }}>{myAccount.bank} <span style={{ color: '#fcd34d' }}>{myAccount.accountNumber}</span></div>
                  <div style={{ fontSize: '13px', color: '#cbd5e1' }}>예금주: {myAccount.holder}</div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', color: '#cbd5e1', marginBottom: '8px' }}>입금자명</label>
                  <input 
                    type="text" 
                    value={depositorName} 
                    onChange={(e) => setDepositorName(e.target.value)}
                    placeholder="실제 입금하실 분의 성함"
                    style={{ width: '100%', padding: '12px', backgroundColor: '#0b132b', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '10px', color: '#fff', boxSizing: 'border-box' }}
                  />
                  <span style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'block' }}>※ 입금 확인 후 풀이가 진행됩니다.</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                  <button 
                    onClick={() => setCurrentPage('home')}
                    style={{ flex: 1, padding: '14px', backgroundColor: '#334155', color: '#cbd5e1', fontWeight: '600', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    취소
                  </button>
                  <button 
                    onClick={handleConfirmDeposit}
                    style={{ flex: 1, padding: '14px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                  >
                    입금 완료 신청
                  </button>
                </div>
              </div>
            )}

            {paymentStep === 'complete' && (
              <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                <div style={{ fontSize: '48px' }}>📩</div>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#fef3c7' }}>입금 확인 신청 완료</h2>
                <p style={{ color: '#cbd5e1', fontSize: '14px', lineHeight: '1.6' }}>
                  <b>{depositorName}</b>님의 입금 신청이 접수되었습니다.<br />
                  입금 확인 후 사주 분석이 시작됩니다.
                </p>
                <div style={{ padding: '14px', backgroundColor: '#0b132b', borderRadius: '10px', fontSize: '13px', color: '#94a3b8' }}>
                  문의사항은 카카오톡 채널 또는 이메일로 연락주세요.
                </div>
                <button 
                  onClick={() => setCurrentPage('input')}
                  style={{ width: '100%', padding: '14px', backgroundColor: '#f59e0b', color: '#0f172a', fontWeight: 'bold', border: 'none', borderRadius: '10px', cursor: 'pointer' }}
                >
                  사주 정보 입력하러 가기
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* 푸터 */}
      <footer style={{ marginTop: '80px', borderTop: '1px solid rgba(245, 158, 11, 0.2)', padding: '30px 20px', textAlign: 'center', backgroundColor: '#0b132b', fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <p>월운(月運) | 대표 서비스</p>
        <p>본 서비스는 오락 및 참고용이며, 중요한 투자나 법률적 판단은 전문가와 상담하세요.</p>
      </footer>
    </div>
  );
}