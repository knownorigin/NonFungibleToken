pragma solidity 0.4.18;

import "./InternalMintableNonFungibleToken.sol";


contract KnownOriginNFT is InternalMintableNonFungibleToken {

    // creates and owns the original assets
    // all primary purchases transfered to this account
    address public curator;

    enum PurchaseState { Unpurchased, CryptoPurchase, FiatPurchase }

    mapping(uint => PurchaseState) internal tokenIdToPurchased;
    mapping(uint => string) internal tokenIdToEdition;
    mapping(uint => uint) internal tokenIdToPriceInWei;

    event Purchased(uint256 indexed _tokenId, address indexed _buyer);
    event PurchasedWithFiat(uint256 indexed _tokenId);

    modifier onlyCurator() {
        require(msg.sender == curator);
        _;
    }

    modifier onlyUnpurchased(uint256 _tokenId) {
        require(tokenIdToPurchased[_tokenId] == PurchaseState.Unpurchased);
        _;
    }

    modifier onlyCuratorOwnedToken(uint256 _tokenId) {
        require(tokenIdToOwner[_tokenId] == curator);
        _;
    }

    function KnownOriginNFT()
    public {
        curator = msg.sender;
        name = "KnownOriginNFT";
        symbol = "KOA";
    }

    function mint(string _metadata, string _edition, uint8 _totalEdition, uint256 _priceInWei)
    public
    onlyCurator {

        for (uint8 i = 0; i < _totalEdition; i++) {
            var _tokenId = i;
            require(tokenIdToOwner[_tokenId] == address(0));
            _mint(msg.sender, _tokenId, _metadata);
            tokenIdToEdition[_tokenId] = _edition;
            tokenIdToPriceInWei[_tokenId] = _priceInWei;
        }
    }

    function isPurchased(uint256 _tokenId)
    public
    view
    returns (PurchaseState _purchased) {
        return tokenIdToPurchased[_tokenId];
    }

    function editionOf(uint _tokenId)
    public
    view
    returns (string _edition) {
        return tokenIdToEdition[_tokenId];
    }

    function priceOfInWei(uint _tokenId)
    public
    view
    returns (uint _edition) {
        return tokenIdToPriceInWei[_tokenId];
    }

    function setPriceInWei(uint _tokenId, uint256 _priceInWei)
    public
    onlyCurator
    onlyUnpurchased(_tokenId)
    onlyCuratorOwnedToken(_tokenId)
    returns (bool) {
        tokenIdToPriceInWei[_tokenId] = _priceInWei;
        return true;
    }

    function purchase(uint _tokenId)
    public
    payable
    onlyUnpurchased(_tokenId)
    onlyCuratorOwnedToken(_tokenId)
    returns (bool) {

        if (msg.value >= tokenIdToPriceInWei[_tokenId]) {

            // approve sender as they have paid the required amount
            _approve(msg.sender, _tokenId);
            Approval(curator, msg.sender, _tokenId);

            // transfer assets from contract creator (curator) to new owner
            transferFrom(curator, msg.sender, _tokenId);

            // now purchased - don't allow re-purchase!
            tokenIdToPurchased[_tokenId] = PurchaseState.CryptoPurchase;

            // send ether to owner instantly
            curator.transfer(msg.value);

            Purchased(_tokenId, msg.sender);

            return true;
        }

        return false;
    }

    function fiatPurchase(uint _tokenId)
    public
    onlyCurator
    onlyUnpurchased(_tokenId)
    onlyCuratorOwnedToken(_tokenId)
    returns (bool) {

        // now purchased - don't allow re-purchase!
        tokenIdToPurchased[_tokenId] = PurchaseState.FiatPurchase;

        PurchasedWithFiat(_tokenId);

        return true;
    }
}